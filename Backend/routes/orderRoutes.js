const express = require("express");
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/requireAuth');
const { isAdmin } = require("../middleware/isAdmin");
const { isUser } = require("../middleware/isUser");

router.use(requireAuth);

router.route('/')
    .get(isAdmin, orderController.getAllOrders)
    .post(isUser, orderController.createOrder);

router.route('/user')
    .get(isUser, orderController.getUserOrders);

router.route('/stats')
    .get(isAdmin, orderController.getAdminStats);

router.route('/:id')
    .put(isAdmin, orderController.updateOrderStatus);

module.exports = router;