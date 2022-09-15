// middleware/auth.js

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res
    //   .status(403)
    //   .send({ message: 'Authorization is Required (L13)' });
    const err = new Error('Authorization is Required');
    err.statusCode = 403;
    next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production'
      ? JWT_SECRET
      : 'dev-secret');
  } catch (err) {
    // console.log(err);
    // return res
    //   .status(401)
    //   .send({ message: 'Authorization Required (L26)' });
    const error = new Error('Please Sign-in again');
    error.statusCode = 401;
    next(error);
  }

  req.user = payload; // assigning the payload to the request object

  next(); // sending the request to the next middleware
  return payload;
};
