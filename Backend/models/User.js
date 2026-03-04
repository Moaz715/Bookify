const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { 
        type: String, 
        default: uuidv4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please enter a valid email address"]
    },
    password:{
        type: String,
        required: true,
        min: 7,
        max: 15
    }
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);