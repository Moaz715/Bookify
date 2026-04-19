const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Book = require('../models/Book');

module.exports.createCheckoutSession = async (req, res) => {
    const { items } = req.body;

    // 1. Get the real books from the database for security
    const booksIds = items.map(i => i.bookId);
    const realBooks = await Book.find({ "_id": { $in: booksIds } });

    // 2. Format the items exactly how Stripe wants them (called "line_items")
    const line_items = items.map(item => {
        const realBook = realBooks.find(b => b._id.toString() === item.bookId);
        
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: realBook.title,
                    images: [realBook.image], // Optional: shows the book cover on the checkout page!
                },
                // Stripe expects amounts in CENTS! So $20.00 is 2000 cents.
                unit_amount: Math.round(realBook.price * 100), 
            },
            quantity: item.quantity,
        };
    });

    // 3. Create the Stripe Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        // Where Stripe sends the user if the payment succeeds
        success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
        // Where Stripe sends them if they click the back button
        cancel_url: 'http://localhost:5173/cart', 
    });

    // 4. Send the Stripe URL back to React so we can redirect the user
    res.status(200).json({ url: session.url });
};