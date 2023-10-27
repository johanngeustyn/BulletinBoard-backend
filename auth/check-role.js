module.exports = (role) => {
    return (req, res, next) => {
        const user = req.user; // assuming you decode the JWT and attach the payload to req.user
        if (user && user.role === role) {
            next();  // user has the required role, proceed
        } else {
            res.status(403).json({ message: "Access Denied" });
        }
    }
}