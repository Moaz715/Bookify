const isUser = async (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: "Admins cannot perform customer actions." });
    }
}

module.exports = {isUser};