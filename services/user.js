const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const { BadRequest } = require('../errors/api.error');

/**
 *
 * @param {Object} userData
 * @returns {object} new saved user
 */
exports.save = async (userData) => {
	let newUser = new UserModel(userData);
	newUser = await newUser.save();
	return newUser;
};

/**
 * Finds the first user document that matches the given argument
 * @param {String} idOrEmail
 * @param {String} fieldName
 * @returns {object} user document or object
 */
exports.getUser = async (idOrEmail, fieldName = '_id') => {
	const user = await UserModel.findOne({ [fieldName]: idOrEmail + '' }).select(
		'-password'
	);
	return user;
};

/**
 * Creates a countDocuments query: counts the number of documents that match filter.
 * @param { string } idOrEmail
 * @param { string } fieldName
 * @returns {Number} number of documents that match user
 */
exports.isUserExists = async (idOrEmail, fieldName = '_id') => {
	return await UserModel.countDocuments({ [fieldName]: idOrEmail });
};

/**
 *
 * @param {string} id
 * @param {object} lastestUpdate
 * @returns {object} newUpdatedUser
 */
exports.updateUser = async (id, lastestUpdate) => {
	const { name, email, isAdmin } = lastestUpdate;

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

	return userUpdate;
};
/**
 *
 * @param {string} id
 * @returns {object} deleted user
 */
exports.deleteUser = async (id) => {
	const deletedUser = await UserModel.deleteMany({ _id: id });
	return deletedUser;
};

/**
 *
 * @returns {object[]} list of deleted users
 */
exports.deleteAllUsers = async () => {
	const deletedUsers = await UserModel.deleteMany({});
	return deletedUsers;
};

/**
 *
 * @param {string} id
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {object} a new user update
 */
exports.changePassword = async (id, currentPassword, newPassword) => {
	const user = await UserModel.updateOne({ _id: id });

	if (!user) return;

	const validPassword = await bcrypt.compare(user.password, currentPassword);

	if (!validPassword) return new BadRequest('Password Miss-Match');

	const salt = await bcrypt.genSalt(10);
	newPassword = await bcrypt.hash(newPassword, salt);
	user.password = newPassword;
	user.updatedAt = new Date.now();

	const result = await user.save();
	return result;
};
