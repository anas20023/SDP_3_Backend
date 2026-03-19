import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies?.auth_token;
    //console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';

    try {
        const decoded = jwt.verify(token, secret);
        //console.log(decoded)
        req.user = {
            id: decoded.user_id,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;
