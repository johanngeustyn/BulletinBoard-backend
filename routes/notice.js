const library = require('../config/library');
const checkAuth = require('../auth/check-auth');
const role = require('../auth/check-role');
const Notice = require('../models/notice');
const Comment = require('../models/comment');
const router = library.express.Router();

// Get all notices (for admin)
router.get('/all', checkAuth, role("admin"), (req, res) => {
    Notice.find()
        .populate('author')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .then(notices => {
            const formattedNotices = notices.map(notice => {
                return {
                    ...notice.toObject(),
                    author: `${notice.author.firstName} ${notice.author.lastName}`,
                    createdAt: library.momentJs(notice.createdAt).format('MMMM Do YYYY, h:mm'),
                    comments: notice.comments.map(comment => ({
                        ...comment.toObject(),
                        author: req.user.id == comment.author._id ? 'You' : `${comment.author.firstName} ${comment.author.lastName}`,
                        createdAt: library.momentJs(comment.createdAt).format('MMMM Do YYYY, h:mm')
                    }))
                };
            });

            res.json({
                message: 'Notices found',
                notices: formattedNotices
            });
        }).catch(err => {
            console.error(err);
        });
});

// Get user department's notices
router.get('', checkAuth, (req, res) => {
    Notice.find({ departments: req.user.department })
        .populate('author')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .then(notices => {
            const formattedNotices = notices.map(notice => {
                return {
                    ...notice.toObject(),
                    author: `${notice.author.firstName} ${notice.author.lastName}`,
                    createdAt: library.momentJs(notice.createdAt).format('MMMM Do YYYY, h:mm'),
                    comments: notice.comments.map(comment => ({
                        ...comment.toObject(),
                        author: req.user.id == comment.author._id ? 'You' : `${comment.author.firstName} ${comment.author.lastName}`,
                        createdAt: library.momentJs(comment.createdAt).format('MMMM Do YYYY, h:mm')
                    }))
                };
            });

            res.json({
                message: 'Notices found',
                notices: formattedNotices
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        });
});

// Get a single notice
router.get('/:id', checkAuth, (req, res) => {
    Notice.findOne({ _id: req.params.id })
        .populate('author')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .then(notice => {
            if (notice) {
                const formattedNotice = {
                    ...notice.toObject(),
                    author: `${notice.author.firstName} ${notice.author.lastName}`,
                    createdAt: library.momentJs(notice.createdAt).format('MMMM Do YYYY, h:mm'),
                    comments: notice.comments.map(comment => ({
                        ...comment.toObject(),
                        author: req.user.id == comment.author._id ? 'You' : `${comment.author.firstName} ${comment.author.lastName}`,
                        createdAt: library.momentJs(comment.createdAt).format('MMMM Do YYYY, h:mm')
                    }))
                };

                res.json({
                    message: 'Notice found',
                    notice: formattedNotice
                });
            } else {
                res.status(404).json({ message: 'Notice not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        });
});

router.post('', checkAuth, role("admin"), (req, res) => {
    const notice = new Notice({
        title: req.body.title,
        content: req.body.content,
        departments: req.body.departments,
        priority: req.body.priority,
        author: req.user.id,
        status: req.body.status,
        tags: req.body.tags,
        attachments: req.body.attachments
    });

    notice.save()
        .then(() => {
            res.status(201).json({
                message: 'Notice posted',
                notice: notice
            });
        }).catch(err => {
            console.error(err);
        });
})

router.put('/:id', checkAuth, role("admin"), (req, res) => {
    const noticeId = req.params.id; // Extracting ID from URL parameter

    Notice.findById(noticeId)
        .then(notice => {
            if (!notice) {
                return res.status(404).json({ message: 'Notice not found' });
            }

            // Update properties
            if (req.body.title) notice.title = req.body.title;
            if (req.body.content) notice.content = req.body.content;
            if (req.body.departments) notice.departments = req.body.departments;
            if (req.body.priority) notice.priority = req.body.priority;
            notice.author = req.user.id;
            if (req.body.status) notice.status = req.body.status;
            if (req.body.tags) notice.tags = req.body.tags;
            if (req.body.attachments) notice.attachments = req.body.attachments;

            // Save updated notice
            return notice.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Notice updated',
                notice: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        });
});

router.delete('/:id', checkAuth, role("admin"), (req, res) => {
    Notice.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({ message: 'Notice Deleted' });
        }).catch(err => {
            console.error(err);
        });
});

// Comments
router.post('/:id/comments', checkAuth, (req, res) => {
    const noticeId = req.params.id;
    const comment = new Comment({
        content: req.body.content,
        author: req.user.id
    });

    comment.save()
        .then(savedComment => {
            return Notice.findByIdAndUpdate(noticeId, {
                $push: { comments: savedComment._id }
            }).then(() => savedComment);
        })
        .then(savedComment => {
            res.status(201).json({
                message: 'Comment added',
                comment: savedComment
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An error occurred' });
        });
});

module.exports = router