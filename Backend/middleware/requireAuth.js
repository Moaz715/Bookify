const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.requireAuth = async (req, res, next) =>{
    
    const {authorization} = req.headers;

    if(!authorization) return res.status(401).json({message: "Authorization token not found!"});

    const token = auth.split(' ')[1];

    const {_id} = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({_id}).select('_id');

    next();
}