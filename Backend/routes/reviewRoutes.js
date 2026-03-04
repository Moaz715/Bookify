const express = require('express');
const router = express.Router({ mergeParams: true }); 
const catchAsync = require('../utils/catchAsync');
const reviewController = require('../controllers/reviewController');

router.route('/')
    .get(catchAsync(reviewController.getBookReviews))
    .post(catchAsync(reviewController.createReview));


router.route('/:reviewId')
    .put(catchAsync(reviewController.updateReview))
    .delete(catchAsync(reviewController.deleteReview));

module.exports = router;