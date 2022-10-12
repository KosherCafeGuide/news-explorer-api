// index.js
// all routes come through here
const router = require('express').Router();

const authenticateRouter = require('./authenticate');
const articleRouter = require('./articles');
const userRouter = require('./users');
const route404 = require('./route404');

router.use('/', authenticateRouter); // sign-up and sign-in

router.use('/articles/', articleRouter);
router.use('/users/', userRouter);
router.use('*', route404);

module.exports = router; // exporting the router
