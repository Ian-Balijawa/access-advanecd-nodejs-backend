const express = require('express');
const bcrypt = require('bcrypt');
const requireLogin = require('../middlewares/authCheck');
const validateUserPayLoad = require('../validations/user');
const { BadRequest } = require('../errors/api.error');
const { UserNotFound } = require('../errors/user.error');
const { logger } = require('../utils/logger');
const router = express.Router();
const UserModel = require('../models/User');

// for already registered user trying to signin
router.post('/', [requireLogin], async (req, res) => {
	const { validationError } = validateUserPayLoad(req.body);
	if (validationError) {
		const error = new BadRequest(validationError.details[0].message);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}
	const { email, password } = req.body;
	const user = await UserModel.findOne({ email }).select('-password');

	if (!user) {
		const httpError = new UserNotFound('Invalid User. User Not Found! ');

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}

	const validPasswword = await bcrypt.compare(password, user.password);

	if (!validPasswword) {
		const httpError = new BadRequest('Invalid email or password');

		return res.status(httpError.status).json({ error: httpError.message });
	}

	const account = user;
	return res.status(200).json({ account });
});

module.exports = router;
