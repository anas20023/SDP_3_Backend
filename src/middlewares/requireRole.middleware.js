const requireRole = (role=[]) => (req, res, next) => {
     console.log(role)
    //console.log(req.user.role)
    if (!role.includes(req.user?.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
export default requireRole
