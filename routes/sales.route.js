const express = require('express');
const router = express.Router();
const debug = require('debug');
const _ = require('lodash');
const logger = require('../helpers/winston.logger');
const isAdmin = require('../middlewares/admin');
const authenticate = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const { validate: validateSale, Sale } = require('../models/sale.model');
const saleController = require('../controllers/sale.controller');
const { Customer } = require('../models/customer.model');
const Fawn = require('fawn');
const { Product } = require('../models/Product.model');

Fawn.init(mongoose);

// get all the available sales
router.get('/', [authenticate, isAdmin], async (req, res) => {
	const sales = await Sale.find({});

	if (!sales)
		return res
			.sendStatus(400)
			.json({ error: 'No sales registered in the database yet.' });

	return res.sendStatus(200).json({ result: sales });
});

// getting a single specific sale from the database
router.get(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: saleId } = req.params;

		const sale = await Sale.findById(saleId);

		if (!sale)
			return res
				.sendStatus(404)
				.json({ error: 'No sale with given id in the database' });

		return res.sendStatus(200).json({ sale });
	}
);

router.post(
	'/',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const idList = _.pick(req.body, ['customerId', 'ProductId']);

		const { error } = validateSale(idList);

		if (error) {
			logger.error(error);
			return res
				.sendStatus(400)
				.json({ error: error.details[0].message });
		}

		const customer = await Sale.findById({ customerId: idList.customerId });
		if (!customer)
			return res.sendStatus(400).json({ error: 'Invalid Customer!' });

		const Product = await Product.findById({ ProductId: idList.ProductId });
		if (!Product)
			return res.sendStatus(400).json({ error: 'Invalid Product!' });

		const saleData = { customer, Product };

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
			.update(
				'customers',
				{ _id: idList.customerId },
				{ $inc: { ProductsBought: 1 } }
			)
			.update(
				'Products',
				{ _id: idList.customerId },
				{ $inc: { purchaseTimes: 1 } }
			)
			.run();

		return res.sendStatus(200).json({ newSale });
	}
);

module.exports = router;
