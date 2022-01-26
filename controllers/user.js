const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserModel = require('../models/User');
const validateUserPayLoad = require('../validations/user');
const { BadRequest, ForbiddenService } = require('../errors/api.error');
const { logger } = require('../utils/logger');
const { handleResponse, handleError } = require('../utils/requestHandlers');
const {
	getUser,
	createUser,
	isUserExists,
	getAll,
} = require('../services/user');

exports.test = async (req, res, next) => {
	try {
		let testdata = { msg: 'Users Test Works' };
		handleResponse({ res, data: testdata });
	} catch (err) {
		handleError({ res, err });
	}
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Response} yes or no message for authorization
 */
exports.authorizedUsertest = async (req, res) => {
	const authToken = req.headers();

	const decodedUserPayLoad = jwt.verify(authToken, config.get('jwtPrivateKey'));
	if (!decodedUserPayLoad) {
		const httpError = new BadRequest('Access Denied. No token Provided.');

		logger.error(httpError.message);

		return res.status(httpError.status).json({ error: httpError.message });
	}

	if (!authData.isAdmin) {
		const httpError = new ForbiddenService(
			'You Have No Authority To Access This API :'
		);

		logger.error(httpError.message);

		return res.status(httpError.status).json({ error: httpError });
	}
	return res
		.status(200)
		.json({ message: 'You are allowed to access this API (:' });
};
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
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} created User
 */
exports.signUp = async (req, res) => {
	const { name, email, password } = req.body;

	const validationError = validateUserPayLoad({
		name,
		email,
		password,
	});

	if (validationError) {
		const httpError = new BadRequest(validationError.details[0].message);

		return res.status(httpError.status).json({ error: httpError.message });
	}

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
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} user
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
 * @returns {Response} current user
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
