const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');

module.exports.createOrder = async (req, res) => {
    try {
        const { items, stripePaymentId = "" } = req.body;

        const booksIds = items.map(i => i.bookId);
        const realBooks = await Book.find({ "_id": { $in: booksIds } });

        let totalAmount = 0;
        const finalItems = [];
        const bulkOps = []
        for (const item of items) {
            const realBook = realBooks.find(b => b._id.toString() === item.bookId);

            if (!realBook) return res.status(404).json({ error: 'Book not found' });
            if (realBook.stock < item.quantity) return res.status(400).json({ error: 'Quantity more than stock' });

            totalAmount += (item.quantity * realBook.price);
            finalItems.push({
                bookId: realBook._id,
                quantity: item.quantity,
                priceAtPurchase: realBook.price
            });

            bulkOps.push({
                updateOne: {
                    filter: { _id: item.bookId },
                    update: { $inc: { stock: -item.quantity } }
                }
            });
        }

        await Book.bulkWrite(bulkOps);


        const newOrder = await Order.create({
            userId: req.user._id,
            items: finalItems,
            totalAmount: totalAmount,
            status: "Processing",
            stripePaymentId
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create order' });
    }
}

module.exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = req.query.page || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('items.bookId', 'title');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch user orders' });
    }
}

module.exports.getAllOrders = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        let query = {};

        if (search) {
            let matchingUsers = await User.find({ email: { $regex: search, $options: 'i' } }).select('_id');
            matchingUsers = matchingUsers.map((u) => u._id);
            query.userId = { $in: matchingUsers };
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'email')
            .populate('items.bookId', 'title');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch orders' });
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Cannot modify a cancelled order." });
        }

        if (status === 'Cancelled') {
            const bulkOps = order.items.map((item)=> ({
                updateOne:{
                    filter: {_id: item.bookId},
                    update: {$inc: {stock: item.quantity}}
                }
            }));

            await Book.bulkWrite(bulkOps);
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to update order status' });
    }
}

module.exports.getAdminStats = async (req, res) => {
    try {
        const booksCount = await Book.countDocuments({});
        const ordersCount = await Order.countDocuments({ status: "Processing" });

        const result = await Order.aggregate([{
            $match: {
                status: 'Delivered',
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }]);

        const finalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

        res.status(200).json({
            booksCount,
            ordersCount,
            totalRevenue: finalRevenue
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch admin stats' });
    }
}