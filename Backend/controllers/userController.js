const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1h' });
}


module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({ email, token, role: user.role});
}


module.exports.signupUser = async (req, res) => {
    const { email, password } = req.body;


    const user = await User.signup(email, password);
    const token = createToken(user._id);

    res.status(200).json({ email, token, role: user.role});

}

