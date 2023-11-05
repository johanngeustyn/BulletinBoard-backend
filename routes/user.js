const library = require('../config/library');
const router = library.express.Router();
const role = require('../auth/check-role');
const checkAuth = require('../auth/check-auth');
const User = require('../models/user');

// Setup store for express-brute
const store = new library.expressBrute.MemoryStore();

// Setup for express-brute to prevent brute-force attacks
const bruteforce = new library.expressBrute(store);

router.post('', checkAuth, role("admin"), (req, res) => {
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
                user: result
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/login', bruteforce.prevent, (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                const error = new Error('Authentication failed. User not found.');
                error.status = 401;
                return next(error);
            }

            library.bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return next(err);
                }

                if (!isMatch) {
                    // Create an error for incorrect password and pass it to next
                    const error = new Error('Authentication failed. Username or password is incorrect.');
                    error.status = 401;
                    return next(error);
                }

                const token = library.jwt.sign({
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    department: user.department
                }, process.env.JWT_SECRET, { expiresIn: '24h' });

                return res.status(200).json({ token: token });
            });
        })
        .catch(err => {
            next(err);
        });
});

// Get all users (only for admin)
router.get('', checkAuth, role("admin"), (req, res) => {
    User.find()
        .then(users => {
            res.json({
                message: 'Users found',
                users: users
            });
        }).catch(err => {
            console.error(err);
        });
});

// Get a single user
router.get('/:id', checkAuth, role("admin"), (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            if (user) {
                res.json({
                    message: 'User found',
                    user: user
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        });
});

// Update user
router.put('/:id', checkAuth, role("admin"), (req, res) => {
    const userId = req.params.id; // Extracting ID from URL parameter

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update properties
            if (req.body.username) user.username = req.body.username;
            if (req.body.firstName) user.firstName = req.body.firstName;
            if (req.body.lastName) user.lastName = req.body.lastName;
            if (req.body.role) user.role = req.body.role;
            if (req.body.department) user.department = req.body.department;

            // Save updated notice
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'User updated',
                user: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        });
});

// Delete user
router.delete('/:id', checkAuth, role("admin"), (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({ message: 'User Deleted' });
        }).catch(err => {
            console.error(err);
        });
})

module.exports = router