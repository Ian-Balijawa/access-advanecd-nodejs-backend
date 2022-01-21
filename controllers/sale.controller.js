const { Sale: SaleModel } = require('../models/sale.model');

const saleController = {};

saleController.createSale = (saleData) => {
	let newSale = new SaleModel();
	const { customer, system } = saleData;

	newSale = {
		customer,
		system,
	};
	SaleModel.create(newSale)
		.then((saleInstance) => {
			saleInstance = saleInstance.toObject();
			saleInstance.saleId = saleInstance._id;

			delete saleInstance._id;
			delete saleInstance._v;

			resolve(saleInstance);
		})
		.catch((err) => reject(err));
};

module.exports = saleController;
