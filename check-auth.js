const library = require('./config/library');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        library.jwt.verify(token, "secret_this_should_be_longer_than_it_is");
        next(); //pass control to the next handler
    }
    catch(err) {
        console.error(err);
        res.status(401).json({
            message: "Invalid token"
        }); 
    }
};