const Joi = require('joi');
const mongoose = require('mongoose');
const timestampsPlugin = require('mongoose-timestamp');

const ProductSchema = new mongoose.Schema({
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
	purchaseTimes: {
		type: Number,
		default: 0,
		min: 0,
		trim,
	},
});
ProductSchema.plugin(timestampsPlugin);
const Product = mongoose.model('Product', ProductSchema);

function validateProduct(Product) {
	const schema = Joi.object({
		name: Joi.string().required().max(255).min(5).trim(),
		price: Joi.number().required().max(5000000).min(1000000).trim(),
		description: Joi.string().required().max(255).min(20).trim(),
		purchaseTimes: Joi.number().min(0),
	});

	return schema.validate(Product);
}

module.exports = {
	validate: validateProduct,
	Product,
};
