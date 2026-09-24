const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createAccessToken = (_id) => {
    return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
};

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
};


module.exports.signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.signup(email, password);

        const accessToken = createAccessToken(user._id, user.role);
        const refreshToken = createRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.status(201).json({ email, role: user.role, accessToken });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}


module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.signup(email, password);

        const accessToken = createAccessToken(user._id, user.role);
        const refreshToken = createRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.status(201).json({ email, role: user.role, accessToken });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}


module.exports.refreshToken = async (req, res) => {
    try {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select('role');
        if (!user) return res.status(401).json({ error: 'User no longer exists' });

        const accessToken = createAccessToken(user._id, user.role);
        res.status(200).json({ accessToken });
    } catch (e) {
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
