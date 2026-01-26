import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token =
        req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
   // console.log(token)
    try {
        const bearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET || 'your_jwt_secret_key'); // Fallback for dev
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};

export default verifyToken;
