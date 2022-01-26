const CustomerModel = require('../models/Customer');
const { BadRequest } = require('../errors/api.error');
const CustomerNotFound = require('../errors/customer.error');
const { logger } = require('../utils/logger');

/**
 * @param {String} id Or Email or any field
 * @param {String} fieldName
 * @returns {object} customer document or object
 */
exports.getCustomer = async (fieldValue, fieldName = '_id') => {
	const customer = await CustomerModel.findOne({ [fieldName]: fieldValue });
	return customer;
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise <Response>} list of all customers
 */
exports.getAllCustomers = async (req, res) => {
	const customers = await CustomerModel.find({});

	if (!allCustomers) {
		const error = new CustomerNotFound('No allCustomers in the Database');

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	return res.status(200).json({ customers });
};

/**
 * Creates a countDocuments query: counts the number of documents that match filter.
 * @param { string } customer email
 * @returns {Promise <Boolean> } whether or not a customer document exists in the database
 */
exports.isCustomerExists = async (email) => {
	const result = await CustomerModel.find({ email });

	return result ? true : false;
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise <Response>} customer
 */
exports.getCustomerById = async (req, res) => {
	const { id } = req.body;

	let customer = await getCustomer(id);
	return res.status(200).json({ customer });
};

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise <Response>} customer
 */
exports.getCustomerByEmail = async (req, res) => {
	const { email } = req.body;

	let customer = await getCustomer(email, 'email');
	return res.status(200).json({ customer });
};

// POSTcreateCustomer

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise <Response>} newly created customer
 */
exports.createCustomer = async (req, res) => {
	const { email } = req.body;

	const result = isCustomerExists(email);
	if (result) {
		const httpError = new BadRequest(
			'Customer with the given email exists in the database'
		);
		return res.status(httpError.status).json({ error: httpError.message });
	}

	const customerData = _.pick(req.body, [
		'name',
		'email',
		'phone',
		'productsBought',
	]);

	let customer = new CustomerModel({
		name: customerData.name,
		email: customerData.email,
		phone: customerData.phone,
		productsBought: customerData.productsBought,
	});
	customer = await customer.save();

	return res.status(200).json({ newCustomer });
};

// updateCustomer

/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise<Response <Customer>>} Customer
 */
exports.updateCustomer = async (req, res) => {
	const { id: id } = req.params;
	const { name, email, phone, productsBought, isGold } = req.body;

	const thereExistsACustomer = isCustomerExists(email);

	if (!thereExistsACustomer) {
		const error = new BadRequest(
			'This email has already been registered. Register with another email'
		);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	const customerUpdate = update(id, {
		name,
		email,
		phone,
		productsBought,
		isGold,
	});

	return res.status(200).json({ customer: customerUpdate });
};

// deleteOne
/**
 *
 * @param {RequestObject} req
 * @param {ResponseObject} res
 * @returns {Promise<DeletedCustomer>} DeletedCustomer
 */
exports.deleteCustomer = async (req, res) => {
	const { id: id } = req.params;

	const deletedCustomer = await CustomerModel.deleteMany({ _id: id });

	if (!deletedCustomer) {
		const httpError = new CustomerNotFound('No customer with given id found.');

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}
	return res.status(httpError.status).json({ deletedCustomer });
};

// deleteAll
/**
 *
 * @returns {Promise <Customers[]>} list of deleted customers
 */
exports.deleteAll = async (req, res) => {
	const deletedCustomers = await CustomerModel.deleteMany({});

	logger.info(deletedCustomers);

	if (!deletedCustomers) {
		const error = new CustomerNotFound(
			'No customers found in the database. All customers must have been already deleted previously'
		);

		logger.error(error.message);

		return res.status(error.status).json({
			error: error.message,
		});
	}

	return deletedCustomers;
};
