const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const isAdmin = require('../middlewares/admin');
const requireLogin = require('../middlewares/authCheck');
const validateObjectId = require('../middlewares/validateObjectId');
const UserModel = require('../models/User');
const validateUserPayLoad = require('../validations/user');
const { BadRequest } = require('../errors/api.error');
const { UserNotFound } = require('../errors/user.error');
const { logger } = require('../utils/logger');

// geting all users
router.get('/', [requireLogin, isAdmin], async (req, res) => {
	let users = await UserModel.find({}).sort({ isAdmin: 1 }).select('-password');

	if (!users) {
		const error = new UserNotFound('No users in the Database');

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	/** we still wouldn't want the client be able to view user passwords even though they're hashed.
	 *	we want to elimate the chance of a hacker landing on our hashed password.
	 *	so we send a user object but without the password
	 */

	return res.json({ users }).status(200);
});

// getting a currently logged in user
router.get('/me', requireLogin, validateObjectId, async (req, res) => {
	const { id } = req.user._id;
	const user = await UserModel.findById(id).select('-password');

	logger.info(user);

	if (!user) {
		const error = new UserNotFound('No user with Given id');

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	return res.status(200).json({ user });
});

// getting a specific user
router.get(
	'/:id',
	requireLogin,
	validateObjectId,
	isAdmin,
	async (req, res) => {
		const user = await UserModel.findOne({ id: req.params.id }).select(
			'-password'
		);

		if (!user) {
			const error = new UserNotFound('No user with Given id');

			logger.error(error.message);

			return res.status(error.status).json({
				error: error.message,
			});
		}

		return res.status(200).json({ user });
	}
);

// for the chance of letting admins to explicitly add users
router.post('/', [requireLogin, isAdmin], async (req, res) => {
	const { validationError } = validateUserPayLoad(req.body);

	if (validationError) {
		const error = new BadRequest(validationError.details[0].message);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}
	const { email } = req.body;
	const result = await UserModel.find({ email });

	if (result) {
		const error = new UserNotFound(
			'Invalid Email!. This email has already been registered'
		);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}
	const userData =
		'isAdmin' in JSON.parse(req.body)
			? _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
			: _.pick(req.body, ['name', 'email', 'password']);

	const salt = await bcrypt.genSalt(10);
	userData.password = await bcrypt.hash(userData.password, salt);
	// let user = await userController.createUser(userData);

	let user = new UserModel({
		name: userData.name,
		email: userData.email,
		password: userData.password,
		isAdmin: userData.isAdmin,
	});

	user = await user.save();

	logger.info(user);

	return res.status(200).json({ user });
});


router.put(
	'/:id',
	[requireLogin, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: id } = req.params;

		const { validationError } = validateUserPayLoad(req.body);

		if (validationError) {
			const httpError = new BadRequest(validationError.details[0].message);

			logger.error(httpError.message);

			return res.status(httpError.status).json({
				error: httpError.message,
			});
		}

		const { name, email, isAdmin } = req.body;

		let user = await UserModel.findByIdAndUpdate(
			id,
			{
				$set: {
					name,
					email,
					isAdmin,
				},
			},
			{ new: true }
		);

		return res.status(200).json({ user });
	}
);

router.delete(
	'/:id',
	[requireLogin, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;
		const deletedUser = await UserModel.findByIdAndRemove(id);

		if (!deletedUser) {
			const error = new UserNotFound('No user with given id found.');

			logger.error(error.message);

			return res.status(error.status).json({
				error: error.message,
			});
		}

		return res.status(200).json({ deletedUser });
	}
);

router.delete(
	'/',
	//  [requireLogin, isAdmin],
	async (req, res) => {
		const deletedUsers = await UserModel.deleteMany({});

		logger.info(deletedUsers);
		if (!deletedUsers) {
			const error = new UserNotFound(
				'No users found in the database. All users must have been already deleted previously'
			);

			logger.error(error.message);

			return res.status(error.status).json({
				error: error.message,
			});
		}

		return res.status(200).json({ deletedUsers });
	}
);

module.exports = router;
