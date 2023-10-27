const library = require('../config/library');
const router = library.express.Router();
const role = require('../auth/check-role');
const User = require('../models/user');

router.post('/signup', role("admin"), (req, res) => {
    library.bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role,
                department: req.body.department,
                password: hash
            });
            return user.save();
        }).then(result => {
            res.status(201).json({
                message: 'User created',
                result: result
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/login', (req, res) => {
    User.findOne({ username:req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Autentication Failure' });
            }

            const token = library.jwt.sign({
                id: user._id,
                username: user.username,
                role: user.role,
                department: user.department
            }, process.env.JWT_SECRET, { expiresIn:'24h' });

            res.status(200).json({ token: token });
        }).catch(err => {
            console.error(err);
            return res.status(401).json({
                message: 'Authentication Failure'
            });
        });
});

module.exports = router