const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');


module.exports.createOrder = async (req, res) => {
    const { items, stripePaymentId = "" } = req.body;

    const booksIds = items.map(i => i.bookId);
    const realBooks = await Book.find({"_id":{$in: booksIds}});

    let totalAmount = 0;
    const finalItems = [];
    for(const item of items){
        const realBook = realBooks.find(b => b._id.toString() === item.bookId);

        if(!realBook) return res.status(404).json({error:'Book not found'});
        if(realBook.stock < item.quantity) return res.status(400).json({error: 'Quantity more than stock'});

        totalAmount += (item.quantity * realBook.price);
        finalItems.push({
            bookId: realBook._id,
            quantity: item.quantity,
            priceAtPurchase: realBook.price
        });

        await Book.updateOne(
            { _id: item.bookId },
            { $inc: { stock: -item.quantity } } 
        );
    }

    const newOrder = await Order.create({
        userId: req.user._id,
        items: finalItems,
        totalAmount: totalAmount,
        status: "Processing",
        stripePaymentId
    });
    

    res.status(201).json(newOrder);
}

module.exports.getUserOrders = async (req, res) => {
    const userId = req.user._id;

    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find({userId}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('items.bookId', 'title');

    res.status(200).json(orders);
}

module.exports.getAllOrders = async (req, res) => {

    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};

    if(search){
        let matchingUsers = await User.find({ email: { $regex: search, $options: 'i' } }).select('_id');

        matchingUsers = matchingUsers.map((u)=>u._id);

        query.userId = {$in: matchingUsers};
    }

    const orders = await Order.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate('userId', 'email').populate('items.bookId', 'title');

    res.status(200).json(orders);
}


module.exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    
    if (order.status === 'Cancelled') {
        return res.status(400).json({ message: "Cannot modify a cancelled order." });
    }

    if (status === 'Cancelled') {
        for (const item of order.items) {
            await Book.updateOne(
                { _id: item.bookId },
                { $inc: { stock: item.quantity } }
            );
        }
    }

    order.status = status;
    await order.save(); 

    res.status(200).json(order);
}

module.exports.getAdminStats = async (req, res) => {
    const booksCount = await Book.countDocuments({});
    const ordersCount = await Order.countDocuments({ status: "Processing" });
    const result = await Order.aggregate([{
        $match: {
            status: 'Delivered',
        }
    },
    {
        $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" }
        }

    }]);
    
    const finalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    
    res.status(200).json({
        booksCount,
        ordersCount,
        totalRevenue: finalRevenue
    })
}