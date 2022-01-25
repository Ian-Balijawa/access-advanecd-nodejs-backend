const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/admin');
const requireLogin = require('../middlewares/authCheck');
const validateObjectId = require('../middlewares/validateObjectId');
const UserModel = require('../models/User');
const { validateUserPayLoad } = require('../middlewares/validateRequestBody');
const { BadRequest } = require('../errors/api.error');
const { logger } = require('../utils/logger');
const {
	getAllUsers,
	getUserByAuthenticationToken,
	getUserById,
} = require('../controllers/user');
const {
	updateUser,
	deleteUser,
	isUserExists,
	createUser,
} = require('../services/user');

// geting all users
router.get('/', [requireLogin, isAdmin], getAllUsers);

// getting a currently logged in user
router.get('/me', requireLogin, validateObjectId, getUserByAuthenticationToken);

// getting a specific user
router.get('/:id', requireLogin, isAdmin, validateObjectId, getUserById);

// for the chance of letting admins to explicitly add users
router.post(
	'/',
	[requireLogin, isAdmin, validateUserPayLoad],
	async (req, res) => {
		const { email } = req.body;

		const result = isUserExists(email);
		if (result) {
			const httpError = new BadRequest(
				'User with the given email exists in the database'
			);
			return res.status(httpError.status).json({ error: httpError.message });
		}

		const newUser = createUser(req.body);
		logger.info(newUser);

		return res.status(200).json({ newUser });
	}
);

router.put(
	'/:id',
	[requireLogin, isAdmin, validateObjectId, validateUserPayLoad],
	async (req, res) => {
		const { id: id } = req.params;
		const { name, email, isAdmin } = req.body;

		const userUpdate = updateUser(id, { name, email, isAdmin });

		return res.status(200).json({ user: userUpdate });
	}
);

router.delete(
	'/:id',
	[requireLogin, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;

		return deleteUser(id);
	}
);

router.delete('/', [requireLogin, isAdmin], async (req, res) => {
	return UserModel.deleteMany({});
});

module.exports = router;
