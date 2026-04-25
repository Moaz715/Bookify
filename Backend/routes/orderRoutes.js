const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const orderController = require('../controllers/orderController');
const {requireAuth} = require('../middleware/requireAuth');
const { isAdmin } = require("../middleware/isAdmin");
const {isUser} = require("../middleware/isUser");

router.use(requireAuth);

router.route('/')
    .get(isAdmin, catchAsync(orderController.getAllOrders))
    .post(isUser, catchAsync(orderController.createOrder));

router.route('/user')
    .get(isUser, catchAsync(orderController.getUserOrders));

router.route('/stats')
    .get(isAdmin, catchAsync(orderController.getAdminStats));

router.route('/:id')
    .put(isAdmin, catchAsync(orderController.updateOrderStatus));

module.exports = router;