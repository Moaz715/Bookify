const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    items: [
        {
            bookId: {
                type: String,
                ref: 'Book',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            priceAtPurchase: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    stripePaymentId: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);