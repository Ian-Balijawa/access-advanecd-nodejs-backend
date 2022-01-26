const express = require('express');
const userAuthenticated = require('../middlewares/authCheck');
const router = express.Router();
const { validateUserPayLoad } = require('../middlewares/validateRequestBody');
const { getUserByAuthenticationToken } = require('../controllers/user');

// for already registered user trying to signin
router.post(
	'/',
	[userAuthenticated, validateUserPayLoad],
	getUserByAuthenticationToken
);

module.exports = router;
