const express = require('express');
const router = express.Router();
const debug = require('debug');
const _ = require('lodash');
const isAdmin = require('../middlewares/admin');
const authenticate = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const ProductController = require('../controllers/Product.controller');
const {
	validate: validateProduct,
	Product,
} = require('../models/Product.model');

// get all the currently availabe Products.
router.get('/', async (req, res) => {
	const result = await Product.find({}).sort({ name: 1 });

	if (!result)
		return res
			.status(404)
			.json({ message: 'No Product uploaded in the database yet!' });

	return res.status(200).json({ result });
});

// getting a single Product from the database by an admin
router.get(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;
		const result = await Product.findById(userId);

		if (!result)
			return res
				.status(404)
				.json({ message: 'No Product with the given id found!' });

		return res.status(200).json({ result });
	}
);

// incase we need some kind of authentication
router.get('/', authenticate, async (req, res) => {
	const result = await Product.find({}).sort({ name: 1 });

	if (!result)
		return res
			.status(404)
			.json({ message: 'No Product uploaded in the database yet!' });

	return res.status(200).json({ result });
});

router.post('/', [authenticate, isAdmin], async (req, res) => {
	const ProductData = req.body;
	const { errors } = validateProduct(ProductData);
	if (errors) {
		debug(errors);
		return res.status(400).json({ message: errors.details[0].message });
	}

	const result = await Product.findOne({ name: sytemData.name });
	if (result)
		return res.status(400).json({
			message: 'Product with this name already exists in the database',
		});

	const Product = await ProductController.createProduct(ProductData);
	debug(Product);

	return res.status(200).json({ Product });
});

router.put(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;
		const { name, price, version, lastUpdate, description, size } =
			req.body;
		const { errors } = validateProduct(req.body);
		if (errors) {
			debug(errors);
			return res.status(400).json({ error: errors.details[0].message });
		}

		const Product = await Product.findByIdAndUpdate(
			id,
			{
				$set: {
					name,
					price,
					version,
					lastUpdate,
					description,
					size,
				},
			},
			{ new: true }
		);

		return res.status(200).json({ Product });
	}
);

// delete all Products from the database
router.delete('/', [authenticate, isAdmin], async (req, res) => {
	const deletedData = await Product.deleteMany();

	if (!deletedData) {
		debug(deletedData);
		return res.status(404).json({
			message:
				'No data found to delete. The database contains no Products.',
		});
	}

	return res.status(200).json(deletedData);
});

// to delete a specific Product from the database
router.delete(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: ProductId } = req.params;

		const deletedProduct = await Product.findByIdAndRemove(ProductId);
		debug(deletedProduct);

		if (!deletedProduct) {
			debug(deletedProduct);
			return res.status(404).json({
				error: 'Product not found in the database. It must have been deleted already or did not exist in the database.',
			});
		}

		return res.status(200).json({ deletedProduct });
	}
);

module.exports = router;
