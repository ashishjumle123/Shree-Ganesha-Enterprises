const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document completely deleted from DB after 5 minutes (300 seconds)
    }
});

module.exports = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
