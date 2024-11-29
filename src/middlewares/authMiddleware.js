const jwt = require('jsonwebtoken');

// Middleware to verify JWT
module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded data (user ID and role) to request object
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware to check user roles
module.exports.checkRoles = (requiredRoles) => {
    return (req, res, next) => {
        if (!requiredRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden: Insufficient privileges.' });
        }
        next();
    };
};
