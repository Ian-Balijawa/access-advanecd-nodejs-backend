const Joi = require('joi');
const mongoose = require('mongoose');
const timestampsPlugin = require('mongoose-timestamp');

const systemSchema = new mongoose.schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		maxlength: 255,
		lowercase: true,
	},
	price: {
		type: Number,
		min: 1000000,
		max: 5000000,
		trim: true,
		required: true,
	},
	description: {
		type: String,
		minlength: 20,
		maxlength: 255,
		required: true,
		trim: true,
	},
	size: { type: String, minlength: 0, trim: true },
	version: { type: String, default: '1.0.0', trim: true },
	lastUpdate: {
		type: Date,
		default: Date.now,
	},
});
systemSchema.plugin(timestampsPlugin);
const System = mongoose.model('System', systemSchema);

function validateSystem(system) {
	const schema = Joi.object({
		name: Joi.string().required().max(255).min(5).trim(),
		price: Joi.number().required().max(5000000).min(1000000).trim(),
		description: Joi.string().required().max(255).min(20).trim(),
	});

	return schema.validate(system);
}

module.exports = {
	validate: validateSystem,
	System,
};
