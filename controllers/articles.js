// controllers/articles.js
// this file is the article controller

const Article = require('../models/article');

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndDelete(req.params.id)
    .orFail(() => {
      const error = new Error('No article found with that id');
      error.statusCode = 404;
      next(error);
    })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.statusCode === 404) {
        const error = new Error('No article found with that id');
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

module.exports.getAllArticles = (req, res, next) => {
  let usersSavedArticlesCount = 0;
  Article.find({}).select('+owner')
    .then((articles) => {
      if (!articles) {
        const error = new Error('No articles found');
        error.statusCode = 404;
        next(error);
      }
      if (articles.owner === req.owner._id) {
        usersSavedArticlesCount += 1;
        res.send({
          data: [
            articles.keyword,
            articles.title,
            articles.text,
            articles.date,
            articles.source,
            articles.link,
            articles.image,
          ],
        });
      }
    })
    .then(() => {
      if (usersSavedArticlesCount === 0) {
        const error = new Error('You have not saved any articles yet');
        error.statusCode = 404;
        next(error);
      } else {
        res.send({ articlesCount: usersSavedArticlesCount });
      }
    })
    .catch((err) => {
      const error = new Error('Server Error');
      error.statusCode = err.code || 500;
      next(error);
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((articles) => res.send({
      data: {
        keyword: articles.keyword,
        title: articles.title,
        text: articles.text,
        date: articles.date,
        source: articles.source,
        link: articles.link,
        image: articles.image,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Invalid Input');
        error.statusCode = 400;
        next(error);
      } else {
        const error = new Error('Server Error');
        error.statusCode = 500;
        next(error);
      }
    });
};
