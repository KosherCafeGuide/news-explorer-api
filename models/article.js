// import validator from 'validator';

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: { // every user has a name field, the requirements for which are described below:
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: { // Date
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String, // URL
    required: true,
  },
  image: { // URL
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});
module.exports = mongoose.models.article || mongoose.model('article', articleSchema);
