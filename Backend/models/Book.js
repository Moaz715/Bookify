const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema

const bookSchema = new Schema({
    _id: { 
        type: String, 
        default: uuidv4
    },
    title:{
        type:String,
        required: true
    },
    authors:{
        type: [String],
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    description:{
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Book', bookSchema);