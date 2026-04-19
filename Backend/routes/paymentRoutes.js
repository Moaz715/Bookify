const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/requireAuth');
const catchAsync = require('../utils/catchAsync');

router.post('/create-checkout-session', requireAuth, catchAsync(paymentController.createCheckoutSession));

module.exports = router;