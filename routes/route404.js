/* eslint no-underscore-dangle: 0 */
const router = require('express').Router();

router.use('/', (req, res, next) => {
  // res.status(404).send({ message: 'Requested resource not found' });
  const errText = 'The page '.concat(req.originalUrl, ' does not exist yet');
  const err = new Error(errText);
  err.statusCode = 404;
  next(err);
});

module.exports = router; // exporting the router
