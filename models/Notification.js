const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: false
    },
    register: {
        type: Date,
        default: Date.now()
    }, 
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);