const { Customer: CustomerModel } = require('../models/customer.model');

const customerController = {};

customerController.create = (customerData) => {
	let newCustomer = new CustomerModel();
	const { name, phone, email, isGold } = customerData;

	newCustomer = {
		name,
		phone,
		email,
		isGold,
	};
	CustomerModel.create(newCustomer)
		.then((customerInstance) => {
			customerInstance = customerInstance.toObject();
			customerInstance.customerId = customerInstance._id;

			delete customerInstance._id;
			delete customerInstance._v;

			resolve(customerInstance);
		})
		.catch((err) => reject(err));
};

module.exports = customerController;
