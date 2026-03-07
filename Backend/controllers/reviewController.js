const Review = require('../models/Review');
const Book = require('../models/Book');

module.exports.createReview = async (req, res) => {
    const { bookId } = req.params;
    const { description, rating } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const newReview = await Review.create({
        bookId,
        userId: req.user._id, 
        description,
        rating
    });

    const newTotalReviews = book.totalReviews + 1;
    const newAverageRating = ((book.averageRating * book.totalReviews) + rating) / newTotalReviews;

    await Book.findByIdAndUpdate(bookId, {
        totalReviews: newTotalReviews,
        averageRating: parseFloat(newAverageRating.toFixed(1)) 
    });

    res.status(201).json(newReview); 
}

module.exports.getBookReviews = async (req, res) => {
    const { bookId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ bookId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email');

    res.status(200).json(reviews);
}


module.exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { description, rating } = req.body;

    const oldReview = await Review.findById(reviewId);
    if(!oldReview) return res.status(404).json({message: "Review not found"});

    const updatedReview = await Review.findByIdAndUpdate(reviewId,
        {
            description,
            rating
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!updatedReview) return res.status(404).json({ message: "Review not found" });

    if (oldReview.rating !== rating) {
        const book = await Book.findById(updatedReview.bookId);
        
        const newAverageRating = ((book.averageRating * book.totalReviews) - oldReview.rating + rating) / book.totalReviews;

        await Book.findByIdAndUpdate(updatedReview.bookId, {
            averageRating: parseFloat(newAverageRating.toFixed(1))
        });
    }

    res.status(200).json(updatedReview);
}

module.exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) return res.status(404).json({ message: "Review not found" });

    const book = await Book.findById(deletedReview.bookId);
    if(!book) return res.status(404).json({message: "Book not found"});

    const newTotalReviews = book.totalReviews - 1;
    let newAverageRating = 0;
    if (newTotalReviews > 0) {
        newAverageRating = ((book.averageRating * book.totalReviews) - deletedReview.rating) / newTotalReviews;
    }

    await Book.findByIdAndUpdate(deletedReview.bookId, {
        totalReviews: newTotalReviews,
        averageRating: parseFloat(newAverageRating.toFixed(1)) 
    });

    res.status(200).json(deletedReview);
}