const library = require('../config/library');

const departmentsList = [
    "Finance",
    "Health",
    "Defense",
    "Transportation",
    "Education",
    "Interior or Home",
    "Foreign Affairs",
    "Trade and Industry",
    "Agriculture",
    "Energy",
    "Environment",
    "Justice or Legal",
    "Labor and Employment",
    "Housing and Urban Development",
    "Tourism and Culture",
    "Communications and IT",
    "Social Welfare",
    "Research and Development",
    "Public Services",
    "Immigration and Border Control"
];

const userSchema = library.mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
        type: String,
        enum: ['viewer', 'editor', 'admin'],
        default: 'viewer',
        require: true
    },
    department: {
        type: String,
        required: true,
        enum: departmentsList
    },
    password: { type: String, required: true }
});

module.exports = library.mongoose.model('User', userSchema);