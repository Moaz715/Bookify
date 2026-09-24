const express = require('express');
const router = express.Router({ mergeParams: true }); 
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/requireAuth');
const { isUser } = require('../middleware/isUser');

router.route('/')
    .get(reviewController.getBookReviews)
    .post(requireAuth, isUser, reviewController.createReview);

router.route('/:reviewId')
    .put(requireAuth, isUser, reviewController.updateReview)
    .delete(requireAuth, isUser, reviewController.deleteReview);

module.exports = router;