// src/models/Form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    agree: Boolean,
    signature: String
});

module.exports = mongoose.model('Form', formSchema);
