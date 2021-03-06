const mongoose = require('mongoose');
const timestampsPlugin = require('mongoose-timestamp');

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
		lowercase: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 255,
		unique: true,
		trim: true,
	},
	isGold: {
		// customer who had bought mutiple times
		type: Boolean,
		required: true,
		default: function (value) {
			return this.productsBought > 1 ? true : false;
		},
	},
	phone: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 10,
	},
	productsBought: {
		type: Number,
		required: true,
		min: 0,
		trim,
	},
});

customerSchema.plugin(timestampsPlugin);
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
