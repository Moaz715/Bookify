const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/requireAuth');

router.post('/create-checkout-session', requireAuth, paymentController.createCheckoutSession);

module.exports = router;