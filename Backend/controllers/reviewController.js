const Review = require('../models/Review');
const Book = require('../models/Book');

module.exports.createReview = async (req, res) => {
    try {
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

        await newReview.populate('userId', 'email');

        res.status(201).json({ review: newReview }); 
    } catch (error) {
        res.status(500).json({ error: error.message || "Error to create review" });
    }
}

module.exports.getBookReviews = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ error: error.message || "Error to fetch reviews" });
    }
}

module.exports.updateReview = async (req, res) => {
    try {
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
        ).populate('userId', 'email');

        if (!updatedReview) return res.status(404).json({ message: "Review not found" });

        res.status(200).json({ review: updatedReview });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error to update review" });
    }
}

module.exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) return res.status(404).json({ message: "Review not found" });

        res.status(200).json({ review: deletedReview });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error to delete review" });
    }
}