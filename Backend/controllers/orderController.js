const Order = require('../models/Order');


module.exports.createOrder = async (req, res) =>{
    const {items, totalAmount, stripePaymentId=""} = req.body;

    const newOrder = await Order.create({
        userId: req.user._id,              
        items,
        totalAmount,
        status : "Processing",
        stripePaymentId
    });

    res.status(201).json(newOrder);
}

module.exports.getUserOrders = async (req, res) =>{
    const userId = req.user._id;            

    const orders = await Order.find({userId}).sort({createdAt:-1}).populate('items.bookId', 'title');

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