const mongoose = require('mongoose');
const Joi = require('joi');
const timestampsPlugin = require('mongoose-timestamp');

const salesSchema = new mongoose.schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 30,
                lowercase: true,
            },
            isGold: { type: Boolean, required: true, default: false },
            phone: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 10,
            },
        }),
        required: true,
    },

    system: {
        type: new mongoose.schema({
        name:{
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 255,
        },
        price: {
            type: Number,
            min: 1000000,
            max:5000000,
            trim:true,
            required:true,
        },
        description: {
            type: String,
            minlength: 20,
            maxlength: 255,
            required: true,
            trim:true,
        },
        size:{ type: String, minlength: 0, trim: true},
        version: {type: String, default: "1.0.0",trim:true},
        lastUpdate: {
            type:Date,
            default:Date.now,
        },
    },
});

salesSchema.plugin(timestampsPlugin);
const Sale = mongoose.model('Sale', salesSchema);

function validateSale(sale) {
	const schema = Joi.object({
		customerId: Joi.string().required(),
		systemId: Joi.string().required(),
	});

	return schema.validate(sale);
}

module.exports = {
	Sale,
	validate: validateSale,
};
