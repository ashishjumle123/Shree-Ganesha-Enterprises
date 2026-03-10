const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    fallback: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Electronics', 'Furniture', 'Home Appliances', 'Other'],
        default: 'Other'
    }
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
