const library = require('../config/library');

const userSchema = library.mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = library.mongoose.model('User', userSchema);