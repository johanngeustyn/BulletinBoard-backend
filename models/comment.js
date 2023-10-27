const library = require('../config/library');

const commentSchema = library.mongoose.Schema({
    content: { type: String, required: true },
    author: {
        type: library.mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = library.mongoose.model('Comment', commentSchema);