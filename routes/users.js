/* eslint no-underscore-dangle: 0 */
const router = require('express').Router(); // creating a router
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');

const {
  getCurrentUser, createUser,
} = require('../controllers/users');

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// route definitions
// router.get('/', auth, getAllUsers);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().custom(validateEmail),
    password: Joi.string(),
  }),
}), createUser);
router.get('/me', auth, celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().required(),
  }),
}), getCurrentUser);

// router.get('/:id', celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().hex().min(24).max(24),
//   }),
// }), getUser);

module.exports = router;
