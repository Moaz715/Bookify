const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    _id: { 
        type: String, 
        default: uuidv4
    },
    description:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        min: 0,
        max: 5
    }
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);