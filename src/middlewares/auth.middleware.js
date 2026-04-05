import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // adjust path if needed

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';

    try {
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.user_id).select('_id role');
        if (!user) {
            res.clearCookie('auth_token'); // trigger logout
            return res.status(401).json({ message: 'User not found. Logged out.' });
        }

        req.user = {
            id: user._id,
            role: user.role,
        };

        next();
    } catch (err) {
        res.clearCookie('auth_token'); // optional: also logout on invalid/expired token
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;
