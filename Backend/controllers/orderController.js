const Order = require('../models/Order');

// User id still not implemented so we will not test this yet

module.exports.createOrder = async (req, res) =>{
    const {items, totalAmount, status, stripePaymentId=""} = req.body;

    const newOrder = await Order.create({
        userId: req.user._id,              //here it is used
        items,
        totalAmount,
        status,
        stripePaymentId
    });

    res.status(201).json(newOrder);
}

module.exports.getUserOrders = async (req, res) =>{
    const {userId} = req.user._id;             //here it is used

    const orders = await Order.find({userId}).sort({createdAt:-1});

    res.status(200).json(orders);
}

module.exports.getAllOrders = async (req, res) =>{

    const orders = await Order.find({}).sort({createdAt:-1});

    res.status(200).json(orders);
}


module.exports.updateOrderStatus = async (req, res) =>{
    const {id} = req.params;
    const {status} = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id,
        {
            status
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updatedOrder);
}