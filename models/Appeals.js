const mongoose = require('mongoose');

const appealsSchema = new mongoose.Schema({
  text: String,
  date: String,
  time: String
});

module.exports = mongoose.model('appeals', appealsSchema, 'appeals');
