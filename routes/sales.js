const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const isAdmin = require('../middlewares/admin');
const userAuthenticated = require('../middlewares/authCheck');
const validateObjectId = require('../middlewares/validateObjectId');
const Sale = require('../models/sale.model');
const validateSale = require('../validations/sale');
const { BadRequest } = require('../errors/system.error');
const { SaleNotFound } = require('../errors/sale.error');
const { CustomerNotFound } = require('../errors/customer.error.');
const { ProductNotFound } = require('../errors/product.error');
const logger = require('../utils/logger');
const Fawn = require('fawn');

Fawn.init(mongoose);

// get all the available sales
router.get('/', [userAuthenticated, isAdmin], async (req, res) => {
	const sales = await Sale.find({});

	if (!sales) {
		const error = new SaleNotFound('No sales registered in the database yet.');

		logger.error(error.message);

		return res.status(error.status).json({ error: error.message });
	}

	return res.status(200).json({ result: sales });
});

// getting a single specific sale from the database
router.get(
	'/:id',
	[userAuthenticated, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: id } = req.params;

		const sale = await Sale.findById(id);

		if (!sale) {
			const error = new SaleNotFound('No sales with the given id');

			logger.error(error.message);

			return res.status(error.status).json({ error: error.message });
		}
		return res.status(200).json({ sale });
	}
);

router.post(
	'/',
	[userAuthenticated, isAdmin, validateObjectId],
	async (req, res) => {
		const { customerId, productId } = req.body;

		const { validationError } = validateSale({ customerId, productId });

		if (validationError) {
			const error = new BadRequest(validationError.details[0].message);

			logger.error(error.message);

			return res.status(error.status).json({ error: error.message });
		}

		const customer = await Sale.findById(customerId);

		if (!customer) {
			const error = new CustomerNotFound('No customer with given Id.');

			logger.error(error.message);

			return res.status(error.status).json({ error: error.message });
		}

		const Product = await Product.findById(productId);

		if (!Product) {
			const error = new ProductNotFound('No Product with given Id.');

			logger.error(error.message);

			return res.status(error.status).json({ error: error.message });
		}

		let newSale = new Sale({
			customer: {
				_id: customer._id,
				name: customer.name,
				phone: customer.phone,
				isGold: customer.isGold,
				email: customer.email,
				ProductsBought: customer.ProductsBought + 1,
			},
			Product: {
				_id: Product._id,
				name: Product.name,
				price: Product.price,
				version: Product.version,
				lastUpdate: Product.lastUpdate,
				size: Product.size,
				purchaseTime: Product.purchaseTimes + 1,
			},
		});

		new Fawn()
			.task()
			.save(newSale)
			.update('customers', { _id: customerId }, { $inc: { ProductsBought: 1 } })
			.update('Products', { _id: productId }, { $inc: { purchaseTimes: 1 } })
			.run();

		return res.status(200).json({ newSale });
	}
);

module.exports = router;
