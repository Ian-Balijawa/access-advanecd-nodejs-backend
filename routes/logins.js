const express = require('express');
const requireLogin = require('../middlewares/authCheck');
const { UserNotFound } = require('../errors/user.error');
const { logger } = require('../utils/logger');
const router = express.Router();
const UserModel = require('../models/User');
const {validateUserPayLoad} = require("../middlewares/validateRequestBody");
const validatePassword = require('../middlewares/validatePassword');
const { isUserExists } = require('../services/user');

// for already registered user trying to signin
router.post('/', [requireLogin, validateUserPayLoad, validatePassword], async (req, res) => {
	const { email } = req.body;
	const user = await UserModel.findOne({ email }).select('-password');

	const thereExistsSuchAUser = isUserExists(email)

	if (!thereExistsSuchAUser) {
		const httpError = new UserNotFound('Invalid User. User Not Found! ');

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}

	const account = user;
	return res.status(200).json({ account });
});

module.exports = router;
