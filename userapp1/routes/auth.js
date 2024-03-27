const jwt = require('jsonwebtoken');
require('dotenv').config();


const secretKey = process.env.AUTH_KEY;

const generateToken = (user) => {
    return jwt.sign({ userId: user.id, username: user.username, email: user.email , password: user.password, role: user.role}, secretKey, { expiresIn: '1h' });
};


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();
    } catch (error) {
        console.error('Token verification error:', error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};



module.exports = {
    generateToken,
    verifyToken
};
