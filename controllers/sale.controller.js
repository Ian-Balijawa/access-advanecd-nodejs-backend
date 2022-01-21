const { Sale: SaleModel } = require('../models/sale.model');

const saleController = {};

saleController.createSale = (saleData) => {
	return new Promise((resolve, reject) => {
		let newSale = new SaleModel();
		const { customer, Product } = saleData;

		newSale = {
			customer,
			Product,
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
	});
};

module.exports = saleController;
