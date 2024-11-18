// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
});

module.exports = mongoose.model('User', userSchema);
