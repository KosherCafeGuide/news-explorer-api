/* eslint no-underscore-dangle: 0 */
const router = require('express').Router(); // creating a router
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { login, createUser } = require('../controllers/users');

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.uri');
};
router.post('/signup/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().custom(validateEmail),
    password: Joi.string(),
  }),
}), createUser);
router.post('/signin/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom(validateEmail),
    password: Joi.string(),
  }),
}), login);

module.exports = router;
