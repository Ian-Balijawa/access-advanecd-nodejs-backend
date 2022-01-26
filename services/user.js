const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const { BadRequest } = require('../errors/api.error');

/**
 * 
 * @param {object} userData 
 * @returns {object} newly created user
 */
exports.createUser = async (userData) => {

	userData = _.pick(req.body, ['name', 'email', 'password']);

	const salt = await bcrypt.genSalt(10);
	userData.password = await bcrypt.hash(userData.password, salt);

	let user = new UserModel({
		name: userData.name,
		email: userData.email,
		password: userData.password,
		isAdmin: userData.isAdmin,
	});
	return await user.save();
}
/**
 * Finds the first user document that matches the given argument
 * we still wouldn't want the client be able to view user passwords even though they're hashed.
 * we want to elimate the chance of a hacker landing on our hashed password.
 * so we send a user object but without the password
 * @param {String} id Or Email or any field
 * @param {String} fieldName
 * @returns {object} user document or object
 */
exports.getUser = async (fieldValue, fieldName = '_id') => {
	const user = await UserModel.findOne({ [fieldName]: fieldValue }).select(
		'-password'
	);
	return user;
};

/**
 * 
 * @param {string} fieldValue 
 * @param {string} fieldName 
 * @returns {object} user document or object containing a password hash
 */
exports.getUserWithHashedPassword = async (fieldValue, fieldName = '_id') => {
	const user = await UserModel.findOne({ [fieldName]: fieldValue });
	return user;
};
    
/**
 * 	we still wouldn't want the client be able to view user passwords even though they're hashed.
	we want to elimate the chance of a hacker landing on our hashed password.
	so we send a user object but without the password
 * @returns all users in the database
 */
exports.getAll = async () => {
	
	const users = await UserModel.find({}).select('-password');
	return users;
};

/**
 * Creates a countDocuments query: counts the number of documents that match filter.
 * @param { string } user email
 * @returns {Promise <Boolean> } whether or not a user document exists in the database
 */
exports.isUserExists = async (email) => {
	
	const result = await UserModel.find({ email });
	
	return result ? true: false;
};

/**
 *
 * @param {string} id
 * @param {object} lastestUpdate
 * @returns {Promise <object> }newUpdatedUser
 */
exports.update = async (id, lastestUpdate) => {
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
 * @returns {Promise <object> }deleted user
 */
exports.delete = async (id) => {
	
	return deletedUser;
};

/**
 *
 * @param {string} id
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise <object> } a new user update
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
