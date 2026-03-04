// backend/controllers/reviewController.js
const Review = require('../models/Review');
const Book = require('../models/Book');

module.exports.createReview = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) return res.status(404).json({ message: "Book not found" });

    const { description, rating } = req.body;

    
    const newReview = await Review.create({
        bookId,
        description,
        rating
    });

    res.status(200).json(newReview);
}

module.exports.getBookReviews = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ bookId: bookId });
    res.status(200).json(reviews);
}

module.exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { description, rating } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(reviewId,
        {
            description,
            rating
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedReview) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(updatedReview);
}

module.exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    
    
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    
    if (!deletedReview) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(deletedReview);
}