const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const validateUserPayLoad = require('../validations/user');
const { BadRequest } = require('../errors/api.error');
const { logger } = require('../utils/logger');

router.post('/', async (req, res) => {
	const { validatationError } = validateUserPayLoad(req.body);

	console.log(validatationError);

	if (validatationError) {
		const error = new BadRequest(validatationError.details[0].message);

		logger.error(error.message);
		return res.status(error.status).json({
			error: error.message,
		});
	}

	const { email } = req.body;
	const result = await UserModel.findOne({ email });

	if (result) {
		const error = new BadRequest(
			'This email has already been registered. Register with another email'
		);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}
	const userData = _.pick(req.body, ['name', 'email', 'password', 'isAdmin']);

	const salt = await bcrypt.genSalt(10);
	userData.password = await bcrypt.hash(userData.password, salt);

	let user = new UserModel({
		name: userData.name,
		email: userData.email,
		password: userData.password,
		isAdmin: userData.isAdmin,
	});

	user = await user.save();

	logger.debug(user);

	const token = user.generateAuthToken();
	user = _.pick(user, ['id', 'name', 'email']);
	logger.debug(token);

	logger.info('user', user);
	return res.set('x-auth-token', token).status(200).json({ user });
});

module.exports = router;
