const express = require('express');
const router = express.Router();
const debug = require('debug');
const _ = require('lodash');
const authenticate = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validateObjectId');
const systemController = require('../controllers/system.controller');
const { validate: validateSystem, System } = require('../models/system.model');

// get all the currently availabe systems.
router.get('/', async (req, res) => {
	const result = await System.find({}).sort({ name: 1 });

	if (!result)
		return res
			.status(404)
			.json({ message: 'No system uploaded in the database yet!' });

	return res.status(200).json({ result });
});
// getting a single system from the database by an admin
router.get(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;
		const result = await System.findById({ userId: id });

		if (!result)
			return res
				.status(404)
				.json({ message: 'No system with the given id found!' });

		return res.status(200).json({ result });
	}
);

// incase we need some kind of authentication
router.get('/', authenticate, async (req, res) => {
	const result = await System.find({}).sort({ name: 1 });

	if (!result)
		return res
			.status(404)
			.json({ message: 'No system uploaded in the database yet!' });

	return res.status(200).json({ result });
});

router.post('/', [authenticate, isAdmin], async (req, res) => {
	const systemData = req.body;
	const { errors } = validateSystem(systemData);
	if (errors) {
		debug(errors);
		return res.status(400).json({ message: errors.details[0].message });
	}

	const result = await System.findOne({ name: sytemData.name });
	if (result)
		return res.status(400).json({
			message: 'system with this name already exists in the database',
		});

	const system = await systemController.createSystem(systemData);
	debug(system);

	return res.status(200).json({ system });
});

router.put(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id } = req.params;
		const { name, price, version, lastUpdate, description, size } =
			req.body;
		const { errors } = validateSystem(req.body);
		if (errors) {
			debug(errors);
			return res.status(400).json({ error: errors.details[0].message });
		}

		const system = await System.findByIdAndUpdate(
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

		return res.status(200).json({ system });
	}
);

// delete all systems from the database
router.delete('/', [authenticate, isAdmin], async (req, res) => {
	const deletedData = await System.deleteMany();

	if (!deletedData) {
		debug(deletedData);
		return res.status(404).json({
			message:
				'No data found to delete. The database contains no systems.',
		});
	}

	return res.status(200).json(deletedData);
});

// to delete a specific system from the database
router.delete(
	'/:id',
	[authenticate, isAdmin, validateObjectId],
	async (req, res) => {
		const { id: systemId } = req.params;

		const deletedSystem = await System.findByIdAndRemove(systemId);
		debug(deletedSystem);

		if (!deletedSystem) {
			debug(deletedSystem);
			return res.status(404).json({
				error: 'System not found in the database. It must have been deleted already or did not exist in the database.',
			});
		}

		return res.status(200).json({ deletedSystem });
	}
);

module.exports = router;
