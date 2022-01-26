const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/admin');
const userAuthenticated = require('../middlewares/authCheck');
const validateObjectId = require('../middlewares/validateObjectId');
const { validateUserPayLoad } = require('../middlewares/validateRequestBody');
const {
	getAllUsers,
	getUserByAuthenticationToken,
	getUserById,
	updateUser,
	deleteUser,
	createUser,
	deleteAllUsers,
} = require('../controllers/user');

// geting all users
router.get('/', [userAuthenticated, isAdmin], getAllUsers);

// getting a currently logged in user
router.get(
	'/me',
	userAuthenticated,
	validateObjectId,
	getUserByAuthenticationToken
);

// getting a specific user
router.get('/:id', userAuthenticated, validateObjectId, isAdmin, getUserById);

// for the chance of letting admins to explicitly add users
router.post('/', userAuthenticated, isAdmin, validateUserPayLoad, createUser);

router.put(
	'/:id',
	[userAuthenticated, isAdmin, validateObjectId, validateUserPayLoad],
	updateUser
);

router.delete(
	'/:id',
	[userAuthenticated, isAdmin, validateObjectId],
	deleteUser
);

router.delete('/', [userAuthenticated, isAdmin], deleteAllUsers);

module.exports = router;
