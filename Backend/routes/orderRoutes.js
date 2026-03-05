const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const orderController = require('../controllers/orderController');
const requireAuth = require('../middleware/requireAuth');

router.use(catchAsync(requireAuth));

router.route('/')
    .get(catchAsync(orderController.getAllOrders))
    .post(catchAsync(orderController.createOrder));

router.route('/user')
    .get(catchAsync(orderController.getUserOrders));


router.route('/:id')
    .put(catchAsync(orderController.updateOrderStatus));

module.exports = router;