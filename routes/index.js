const router = require('express').Router();
const users = require('./users.route');
const isAuthenticated = require('../middlewares/authCheck');

router.use('/users', users);

module.exports = router;
