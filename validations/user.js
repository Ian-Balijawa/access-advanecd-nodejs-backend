const Joi = require("joi");

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().required().min(3).max(255).trim(),
		email: Joi.string().required().email().min(6).max(255),
		password: Joi.string().required().min(5).max(255),
		isAdmin: Joi.bool(),
	});

	return schema.validate(user);
}
module.exports = validateUser;