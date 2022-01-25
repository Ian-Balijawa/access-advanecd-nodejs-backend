const Joi = require("joi");

function validateCustomer(customer) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required(),
		phone: Joi.string().min(10).max(13).required(),
		isGold: Joi.boolean().required(),
	});

	return schema.validate(customer);
}

module.exports = validateCustomer;