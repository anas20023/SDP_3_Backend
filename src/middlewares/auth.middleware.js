import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = {
            id: decoded.sub,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;
