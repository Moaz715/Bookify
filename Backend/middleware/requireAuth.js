const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = {_id: decoded._id, role: decoded.role};

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = {requireAuth};