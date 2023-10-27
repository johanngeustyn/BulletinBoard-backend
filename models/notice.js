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

const noticeSchema = library.mongoose.Schema({
    
    // Title of the Notice
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Content or Description of the Notice
    content: {
        type: String,
        required: true
    },

    // Departments Involved
    departments: [{
        type: String,
        required: true,
        enum: departmentsList // List all department names or codes
    }],

    // Date and Time of Posting
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Last Updated Date and Time
    updatedAt: {
        type: Date
    },

    // Priority Level
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },

    // Author or Poster Information
    author: {
        type: library.mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Status of the Notice (e.g., open, in-progress, resolved, closed)
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },

    // Tags or Categories for the Notice
    tags: [{
        type: String
    }],

    // Attachments (Can be file URLs or references to another collection storing file data)
    attachments: [{
        type: String
    }],

    // Comments or Discussions related to the Notice
    comments: [{
        type: library.mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = library.mongoose.model('Notice', noticeSchema);