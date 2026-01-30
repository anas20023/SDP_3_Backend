import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
    const token =
        req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const bearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        //console.log(bearer)
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET || 'your_jwt_secret_key'); // Fallback for dev
        req.user = decoded;
        if (req.user.role != "admin") {
            throw new Error("You are not authorized for this Operation")
        }
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
    return next();
};
export default verifyAdmin;
