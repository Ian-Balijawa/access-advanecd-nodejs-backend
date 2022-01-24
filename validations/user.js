const Joi = require("joi");

/**
 * 
 * @param {object} user 
 * @returns {object} validation result
 */
module.exports = function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().required().min(3).max(255).trim(),
		email: Joi.string().required().email().min(6).max(255),
		password: Joi.string().required().min(5).max(255),
		isAdmin: Joi.bool(),
	});

	return schema.validate(user);
}