/* eslint no-underscore-dangle: 0 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/newsExplr');
const helmet = require('helmet');

app.use(express.json());

const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const articleRouter = require('./routes/articles');
const userRouter = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const route404 = require('./routes/route404');

const { PORT = 3000 } = process.env;
// An array of domains from which cross-domain requests are allowed
// const allowedOrigins = [
//   'https://davids-p15.students.nomoredomainssbs.ru',
//   'https://www.davids-p15.students.nomoredomainssbs.ru',
//   'https://api.davids-p15.students.nomoredomainssbs.ru',
//   'http://localhost:3000',
// ];
app.use(helmet());
app.use(cors());
app.options('*', cors());

app.use(requestLogger);
app.post('/signin/', login);
app.post('/signup/', createUser);

app.use('/articles/', articleRouter);
app.use('/users/', userRouter);
app.use('*', route404)

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check the status and display a message based on it
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
