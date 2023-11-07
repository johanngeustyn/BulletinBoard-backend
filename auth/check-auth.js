const library = require('../config/library');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        library.jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403); // Forbidden
            req.user = decoded;
            next();
        });
    }
    catch(err) {
        console.error(err);
        res.status(401).json({
            message: "Invalid token"
        }); 
    }
};