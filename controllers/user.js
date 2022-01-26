const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserModel = require('../models/User');
const validateUserPayLoad = require('../validations/user');
const { BadRequest, ForbiddenService } = require('../errors/api.error');
const UserNotFound = require('../errors/user.error');
const { logger } = require('../utils/logger');
const {
	getUser,
	createUser,
	isUserExists,
	getAll,
	update,
} = require('../services/user');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} user account
 */
exports.login = async (req, res) => {
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
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise <Response>} user account
 */
exports.signUp = async (req, res) => {
	const { name, email, password } = req.body;

	const result = isUserExists(email);

	if (result) {
		const error = new BadRequest(
			'This email has already been registered. Register with another email'
		);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	return res
		.status(200)
		.json({ user: await createUser({ name, email, password }) });
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise <Response>} user
 */
exports.getUserById = async (req, res) => {
	const { id } = req.body;

	let user = await getUser(id);
	return res.status(200).json({ user });
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise <Response>} list of all users
 */
exports.getAllUsers = async (req, res) => {
	const allUsers = await getAll();
	if (!allUsers) {
		const error = new UserNotFound('No allUsers in the Database');

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	return res.status(200).json({ users });
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise <Response>} user
 */
exports.getUserByEmail = async (req, res) => {
	const { email } = req.body;

	let user = await getUser(email, 'email');
	return res.status(200).json({ user });
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise <Response>} current user
 */
exports.getUserByAuthenticationToken = async (req, res) => {
	const authToken = req.header('x-auth-token');
	if (!authToken) {
		const httpError = new BadRequest('Access denied. No token provided.');
		return res.status(httpError.status).json({ error: httpError.message });
	}

	const decodedUserPayLoad = jwt.verify(authToken, config.get('jwtPrivateKey'));

	let user = await getUser(decodedUserPayLoad._id);
	return res.status(200).json({ user });
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise <Response>} newly created user
 */
exports.createUser = async (req, res) => {
	const { email } = req.body;

	const result = getUserByEmail(Email);
	if (result) {
		const httpError = new BadRequest(
			'User with the given email exists in the database'
		);
		return res.status(httpError.status).json({ error: httpError.message });
	}

	const userData = _.pick(req.body, ['name', 'email', 'password']);

	const salt = await bcrypt.genSalt(10);
	userData.password = await bcrypt.hash(userData.password, salt);

	let user = new UserModel({
		name: userData.name,
		email: userData.email,
		password: userData.password,
	});
	user = await user.save();

	return res.status(200).json({ newUser });
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise<Response <user|Error>>}
 */
exports.updateUser = async (req, res) => {
	const { id: id } = req.params;
	const { name, email, isAdmin } = req.body;

	const thereExistsAUser = isUserExists(email);

	if (!thereExistsAUser) {
		const httpError = new UserNotFound(
			'No user with given address'
		);

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}

	let userUpdate = await UserModel.findByIdAndUpdate(
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

	return res.status(200).json({ userUpdate });
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise<DeletedUser>} deleted user
 */
exports.deleteUser = async (req, res) => {
	const { id: id } = req.params;

	const deletedUser = await UserModel.deleteMany({ _id: id });

	if (!deletedUser) {
		const httpError = new UserNotFound('No user with given id found.');

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}
	return res.status(httpError.status).json({ deletedUser });
};

/**
 *
 * @returns {Promise <Users[]>} list of deleted users
 */
exports.deleteAllUsers = async (req, res) => {
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

	return deletedUsers;
};
