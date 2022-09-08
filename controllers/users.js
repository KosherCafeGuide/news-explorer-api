// controllers/users.js
// this file is the user controller

const bcrypt = require('bcrypt'); // importing bcrypt
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('No user found with that id');
      error.statusCode = 404;
      next(error);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        const error = new Error('No user found with that id');
        error.statusCode = 404;
        next(error);
      } else if (err.name === 'CastError') {
        const error = new Error('Invalid ID');
        error.statusCode = 400;
        next(error);
      } else {
        const error = new Error('Server Error');
        error.statusCode = 500;
        next(error);
      }
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  // auth middleware, after verifying JWT Token, adds user._id to req
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error('No user found with that id');
      error.statusCode = 404;
      next(error);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        const error = new Error('No user found with that id');
        error.statusCode = 404;
        next(error);
      } else if (err.name === 'CastError') {
        const error = new Error('Invalid ID');
        error.statusCode = 400;
        next(error);
      } else {
        const error = new Error('Server Error');
        error.statusCode = 500;
        next(error);
      }
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err);
      const error = new Error(err.message);
      error.statusCode = 500;
      next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name: name || 'David',
      email,
      password: hash,
    })
      .then((user) => res.send({ data: [user.name, user.email] }))
      .catch(
        (err) => {
          console.log(err);
          if (err.code === 11000) {
            const error = new Error('Email already registered');
            error.statusCode = 409;
            next(error);
          }
          if (err.name === 'ValidationError') {
            const error = new Error('Invalid Input');
            error.statusCode = 400;
            next(error);
          } else {
            const error = new Error('Server Error');
            error.statusCode = 500;
            next(error);
          }
        },
      ));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let thisUser = {};
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect password or email'));
      }
      thisUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // the hashes didn't match, rejecting the promise
        return Promise.reject(new Error('Incorrect password or email'));
      }
      // successful authentication
      const token = jwt.sign(
        { _id: thisUser._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
      return token;
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err.message);
      error.statusCode = 401;
      next(error);
    });
};
