const express = require('express');
const router = express.Router();
const _ = require('lodash');
const isAdmin = require('../middlewares/admin');
const userAuthenticated = require('../middlewares/authCheck');
const validateObjectId = require('../middlewares/validateObjectId');
// const ProductController = require('../controllers/Product.controller');
const { BadRequest } = require('../errors/system.error');
const { ProductNotFound } = require('../errors/product.error');
const Product = require('../models/Product.model');
const  validateProduct  = require("../validations/product")
const logger = require('../utils/logger');

// get all the currently availabe Products.
router.get('/', async (req, res) => {
	const result = await Product.find({}).sort({ name: 1 });

	if (!result) {
		const error = new ProductNotFound(
			'No Product uploaded in the database yet!'
		);

		logger.error(error.message);
		return res.status(error.message).json({ error: error.message });
	}

	return res.status(200).json({ result });
});

// getting a single Product from the database by an admin
router.get(
	'/:id',
	[userAuthenticated, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;

		const result = await Product.findById(id);

		if (!result) {
			const error = new ProductNotFound(
				'No Product with the given id found!'
			);

			logger.error(error.message);
			return res.status(error.status).json({ error: error.message });
		}

		return res.status(200).json({ result });
	}
);

// incase we need some kind of authentication
router.get('/', userAuthenticated, async (req, res) => {
	const result = await Product.find({}).sort({ name: 1 });

	if (!result) {
		const error = new ProductNotFound(
			'No Product uploaded in the database yet!'
		);

		logger.error(error.message);
		return res.status(error.status).json({ error: error.message });
	}

	return res.status(200).json({ result });
});

router.post('/', [userAuthenticated, isAdmin], async (req, res) => {
	const ProductData = req.body;

	const { validationError } = validateProduct(ProductData);

	if (validationError) {
		const error = new BadRequest(validationError.details[0].message);

		logger.error(error.message);
		return res.status(error.status).json({ error: error.message });
	}

	const result = await Product.findOne({ name: sytemData.name });

	if (result) {
		const error = new BadRequest(
			'Product with this name already exists in the database'
		);

		logger.error(error.message);
		return res.status(error.status).json({
			message: error.message,
		});
	}

	// const Product = await ProductController.createProduct(ProductData);

	let product = new Product({
		name:productData.name,
		price:productData.price,
		version:productData.version,
		lastUpdate: productData.lastUpdate,
		purchaseTimes:productData.purchaseTimes
		size:productData.size,
		description:productData.description,

	})

	product = await product.save()
	logger.info(product);

	return res.status(200).json({ Product });
});

router.put(
	'/:id',
	[userAuthenticated, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;

		const { name, price, version, lastUpdate, description, size } =
			req.body;

		const { validationError } = validateProduct(req.body);

		if (validationError) {
			const error = new BadRequest(validationError.details[0].message);

			logger.error(error.message);
			return res.status(err.status).json({ error: error.message });
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
router.delete('/', [userAuthenticated, isAdmin], async (req, res) => {
	const deletedData = await Product.deleteMany();

	if (!deletedData) {
		logger.info(deletedData);

		const error = new ProductNotFound(
			'No data found to delete. The database contains no Products.'
		);

		logger.error(error.message);
		return res.status(error.status).json({
			error: error.message,
		});
	}

	return res.status(200).json(deletedData);
});

// to delete a specific Product from the database
router.delete(
	'/:id',
	[userAuthenticated, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: id } = req.params;

		const deletedProduct = await Product.findByIdAndRemove(id);

		logger.info(deletedProduct);

		if (!deletedProduct) {
			const error = new ProductNotFound(
				'Product not found in the database. It must have been deleted already or did not exist in the database.'
			);

			logger.error(error.message);
			return res.status(error.status).json({
				error: error.message,
			});
		}

		return res.status(200).json({ deletedProduct });
	}
);

module.exports = router;
