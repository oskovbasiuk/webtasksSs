const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  header: String,
  body: String,
  img: String
});

module.exports = mongoose.model('news', newsSchema, 'news');
