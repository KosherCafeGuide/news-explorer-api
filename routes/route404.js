/* eslint no-underscore-dangle: 0 */
const router = require('express').Router();

router.use('/', (req, res, next) => {
  // res.status(404).send({ message: 'Requested resource not found' });
  const err = new Error('That page does not exist yet');
  err.statusCode = 404;
  next(err);
});

module.exports = router; // exporting the router