const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/admin');
const authenticate = require('../middlewares/authCheck');
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
router.get('/', [authenticate, isAdmin], getAllUsers);

// getting a currently logged in user
router.get('/me', authenticate, validateObjectId, getUserByAuthenticationToken);

// getting a specific user
router.get('/:id', authenticate, validateObjectId, isAdmin, getUserById);

// for the chance of letting admins to explicitly add users
router.post('/', authenticate, isAdmin, validateUserPayLoad, createUser);

router.put(
	'/:id',
	[authenticate, isAdmin, validateObjectId, validateUserPayLoad],
	updateUser
);

router.delete('/:id', [authenticate, isAdmin, validateObjectId], deleteUser);

router.delete('/', [authenticate, isAdmin], deleteAllUsers);

module.exports = router;
