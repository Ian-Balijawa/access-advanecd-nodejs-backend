const express = require('express');
const authenticate = require('../middlewares/authCheck');
const router = express.Router();
const { validateUserPayLoad } = require('../middlewares/validateRequestBody');
const { getUserByAuthenticationToken } = require('../controllers/user');

// for already registered user trying to signin
router.post(
	'/',
	[authenticate,validateUserPayLoad],
	getUserByAuthenticationToken
);

module.exports = router;
