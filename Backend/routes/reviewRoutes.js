const express = require('express');
const router = express.Router({ mergeParams: true }); 
const catchAsync = require('../utils/catchAsync');
const reviewController = require('../controllers/reviewController');
const {requireAuth} = require('../middleware/requireAuth');

router.route('/')
    .get(catchAsync(reviewController.getBookReviews))
    .post(requireAuth, catchAsync(reviewController.createReview));


router.route('/:reviewId')
    .put(requireAuth, catchAsync(reviewController.updateReview))
    .delete(requireAuth, catchAsync(reviewController.deleteReview));

module.exports = router;