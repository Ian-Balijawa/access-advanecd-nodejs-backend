const { Product: ProductModel } = require('../models/Product.model');

const ProductController = {};

ProductController.createProduct = (ProductData) => {
	return new Promise((resolve, reject) => {
		let newProduct = new ProductModel();
		const { name, price, version, description, size, lastUpdate } =
			ProductData;

		newProduct = {
			name,
			price,
			version,
			description,
			size,
			lastUpdate,
		};
		ProductModel.create(newProduct)
			.then((ProductInstance) => {
				ProductInstance = ProductInstance.toObject();
				ProductInstance.ProductId = ProductInstance._id;

				delete ProductInstance._id;
				delete ProductInstance._v;

				resolve(ProductInstance);
			})
			.catch((err) => reject(err));
	});
};

module.exports = ProductController;
