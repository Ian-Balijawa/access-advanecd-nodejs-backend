const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authenticate = require('../middlewares/auth');
const isadmin = require('../middlewares/admin');
const {
	Customer,
	validate: validateCustomer,
} = require('../models/customer.model');
const customerController = require('../controllers/customer.controller');
const validateObjectId = require('../middlewares/validateObjectId');

router.get('/', [authenticate, isAdmin], async (req, res) => {
	const customers = await Customer.find({});
	if (!customers) {
		debug(customers);
		return res
			.status(404)
			.json({ error: 'No customers in the database yet.' });
	}
	return res.status(200).json({ customers });
});

router.get(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: customerId } = req.params;

		const customer = await Customer.findOne({ customerId });
		if (!customer) {
			debug(customer);
			return res.status(404).json({
				error: 'No customer with the given id in the database!',
			});
		}
		return res.status(200).json({ result: customer });
	}
);

router.post('/', [authenticate, isAdmin], async (req, res) => {
	const customerData = _.pick(req.body, ['name', 'email', 'phone', 'isgold']);

	const { error } = validateCustomer(customerData);

	if (error) {
		debug(error);
		return res.status(400).json({ error: error.details[0].message });
	}

	const result = await Customer.findOne({ email: customerData.email });
	if (result)
		return res.status(400).json({
			message: 'Customer with this email already exists in the database',
		});

	const customer = await customerController.create(customerData);
	return res.status(200).json({ customer });
});

router.put(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: customerId } = req.params;
		const customerData = _.pick(req.body, [
			'name',
			'email',
			'phone',
			'isGold',
		]);
		const { error } = validateCustomer(customerData);
		if (error) {
			debug(error); //bad request
			return res.status(400).json({ error: error.details[0].message });
		}
		const { name, email, phone, isGold } = customerData;
		const customerUpdate = await Customer.findByIdAndUpdate(
			customerId,
			{
				$set: {
					name,
					email,
					phone,
					isGold,
				},
			},
			{ new: true }
		);

		return res.status(200).json({ customerUpdate });
	}
);

// to delete a specific customer from the database
router.delete(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: customerId } = req.params;

		const deletedCustomer = await Customer.findByIdAndRemove(customerId);
		debug(deletedCustomer);

		if (!deletedCustomer) {
			debug(deletedCustomer);
			return res.status(404).json({
				error: 'Customer not found in the database. This resource must have been deleted already or did not exist in the database.',
			});
		}

		return res.status(200).json({ deletedCustomer: deletedCustomer });
	}
);

// delete all customers from the database
router.delete('/', [authenticate, isAdmin], async (req, res) => {
	const deletedData = await Customer.deleteMany();

	if (!deletedData) {
		debug(deletedData);
		return res.status(404).json({
			message:
				'No data found to delete. The database contains no customers.',
		});
	}

	return res.status(200).json(deletedData);
});

module.exports = router;
