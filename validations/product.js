const Joi = require("joi");

function validateProduct(Product) {
	const schema = Joi.object({
		name: Joi.string().required().max(255).min(5).trim(),
		price: Joi.number().required().max(5000000).min(1000000).trim(),
		description: Joi.string().required().max(255).min(20).trim(),
		purchaseTimes: Joi.number().min(0),
	});

	return schema.validate(Product);
}

module.exports = validateProduct;