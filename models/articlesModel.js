const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
  date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  src: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/.+\/?#?/i.test(v);
      },
    },
  },
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/.+\/?#?/i.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
