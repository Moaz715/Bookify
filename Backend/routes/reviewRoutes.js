const express = require('express');
const router = express.Router({ mergeParams: true }); 
const catchAsync = require('../utils/catchAsync');
const reviewController = require('../controllers/reviewController');
const {requireAuth} = require('../middleware/requireAuth');
const {isUser} = require('../middleware/isUser');

router.route('/')
    .get(catchAsync(reviewController.getBookReviews))
    .post(requireAuth, isUser, catchAsync(reviewController.createReview));


router.route('/:reviewId')
    .put(requireAuth, isUser, catchAsync(reviewController.updateReview))
    .delete(requireAuth, isUser, catchAsync(reviewController.deleteReview));

module.exports = router;