/* eslint no-underscore-dangle: 0 */
const router = require('express').Router(); // creating a router
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');

const {
  deleteArticle, getAllArticles, createArticle,
} = require('../controllers/articles');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().min(24).max(24),
  }),
}), deleteArticle);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL),
  }),
}), createArticle);
router.get('', auth, getAllArticles);

module.exports = router; // exporting the router
