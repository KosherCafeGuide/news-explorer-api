// import validator from 'validator';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // every user has a name field, the requirements for which are described below:
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
    minlength: 2, // the minimum length of the name is 2 characters
    maxlength: 30, // the maximum length is 30 characters
  },
  email: { //Email
    type: String,
    required: true,
    unique: true,
  },
  password: { // Hash
    type: String,
    required: true,
    select: false,
  },
});
module.exports = mongoose.models.user || mongoose.model('user', userSchema);
