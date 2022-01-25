const Joi = require("joi")

function validateSale(sale) {
	const schema = Joi.object({
		id: Joi.string().required(),
		id: Joi.string().required(),
	});

	return schema.validate(sale);
}

module.exports = validateSale;