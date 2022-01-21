const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const debug = require('debug');
const isAdmin = require('../middlewares/admin');
const authenticateUser = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const { User, validate } = require('../models/user.model');
const userController = require('../controllers/user.controller');

// geting all users
router.get('/', [authenticateUser, isAdmin], async (req, res) => {
	let users = await User.find({}).sort({ name: 1 });

	if (!users)
		return res.status(404).json({
			message: 'No users in the Database',
		});

	// we still wouldn't want the client be able to view user passwords even though they're hashed.
	// we want to elimate the chance of a hacker landing on our hashed password. so we send a user object
	// but without the password
	users = JSON.parse(users);
	users.forEach((user) => delete user.password);

	users =
		req.query && req.query.sortBy && req.query.sortBy === 'name'
			? users.sort((a, b) => a.name - b.name)
			: req.query && req.query.sortBy && req.query.sortBy === 'email'
			? users.sort((a, b) => a.email - b.email)
			: users;

	return res.json({ users }).status(200);
});

// getting a currently loggedin user
router.get('/me', [validateObjectId, authenticateUser], async (req, res) => {
	const { userId } = req.body;
	const user = await User.findById(userId).select('-password');

	debug(user);

	if (!user)
		return res.status(404).json({ message: 'No user with Given id' });

	return res.status(200).json({ user });
});

// getting a specific user
router.get(
	'/:id',
	[admin, authenticateUser],
	validateObjectId,
	async (req, res) => {
		const user = await User.findOne({ userId: req.params.id }).select(
			'-password'
		);

		if (!user)
			return res.status(404).json({ message: 'No user with Given id' });

		return res.status(200).json({ user });
	}
);

router.post('/reigster', async (req, res) => {
	const { error } = validate(req.body);

	if (error) {
		debug(error);
		return res.status(400).json({ message: error.details[0].message });
	}

	const { email } = req.body;
	const result = await User.find({ email });

	if (result) {
		debug(result);
		return res.status(400).json({
			message:
				'This email has already been registered. Register again but with another email',
		});
	}
	const userData =
		isAdmin in JSON.parse(req.body)
			? _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
			: _.pick(req.body, ['name', 'email', 'password']);

	const salt = await bcrypt.genSalt(10);
	userData.password = await bcrypt.hash(userData.password, salt);
	let user = await userController.createUser(userData);
	debug(user);

	const authToken = user.generateAuthtoken();
	user = _.pick(user, ['userId', 'name', 'email']);

	return res.set('x-auth-token', authToken).status(200).json({ user });
});

// for already registered user trying to signin
router.post('/sign-in', [authenticateUser], async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		debug(error);
		return res.status(400).json({ message: error.details[0].message });
	}
	const { email } = req.body;
	const user = await User.find({ email });

	if (!user) return res.status(404).json({ message: 'User not found' });

	const account = user;
	return res.status(200).json({ account: user });
});

// for the chance of letting admins to explicitly add users

router.post('/', [authenticateUser, isAdmin], async (req, res, next) => {
	const { error } = validate(req.body);

	if (error) {
		debug(error);
		return res.status(400).json({ message: error.details[0].message });
	}
	const { email } = req.body;
	const result = await User.find({ email });

	if (result) {
		debug(result);
		return res.status(400).json({
			message:
				'This email has already been registered. Register again but with another email',
		});
	}
	const userData =
		'isAdmin' in JSON.parse(req.body)
			? _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
			: _.pick(req.body, ['name', 'email', 'password']);

	const salt = await bcrypt.genSalt(10);
	userData.password = await bcrypt.hash(userData.password, salt);
	let user = await userController.createUser(userData);
	debug(user);

	return res.status(200).json({ user });
});

router.put(
	'/:id',
	[authenticateUser, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: userId } = req.params;

		const { error } = validate(req.body);

		if (error) {
			debug(error);
			return res.status(400).json({ err: error.details[0].message });
		}

		const { name, email, isAdmin } = req.body;

		let user = await User.findByIdAndUpdate(
			userId,
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
	[authenticateUser, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: userId } = req.params;
		const deletedUser = await User.findByIdAndRemove(userId);

		return res.status(200).json({ deletedUser });
	}
);

module.express = router;
