const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const timestampPlugin = require('mongoose-timestamp');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
	password: {
		type: String,
		minlength: 5,
		maxlength: 255,
	},
	isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, email: this.email, isAdmin: this.isAdmin },
		config.get('jwtPrivateKey'),
		{ expiresIn: '24h' }
	);

	return token;
};
userSchema.plugin(timestampPlugin);
const User = mongoose.model('User', userSchema);

module.exports = User