// router.get('/', [userAuthenticated, isAdmin], async (req, res) => {
// 	const customers = await Customer.find({});
// 	if (!customers) {
// 		logger.info(customers);

// 		const err = new CustomerNotFound('No customers in the database yet!');

// 		logger.error(error.message);
// 		return res.status(err.status).json({ error: err.message });
// 	}
// 	return res.status(200).json({ customers });
// });

// router.get(
// 	'/:id',
// 	[userAuthenticated, isAdmin, validateObjectId],
// 	async (req, res) => {
// 		const { id } = req.params;

// 		const customer = await Customer.findOne({ id });
// 		if (!customer) {
// 			logger.info(customer);

// 			const err = new CustomerNotFound(
// 				'No customer with the given id in the database!'
// 			);

// 			logger.error(error.message);
// 			return res.status(err.status).json({
// 				error: err.message,
// 			});
// 		}
// 		return res.status(200).json({ result: customer });
// 	}
// );

// router.post('/', [userAuthenticated, isAdmin], async (req, res) => {
// 	const customerData = _.pick(req.body, ['name', 'email', 'phone', 'isgold']);

// 	const { validationError } = validateCustomer(customerData);

// 	if (validationError) {
// 		const err = new CustomerNotFound(validationError.details[0].message);

// 		logger.error(error.message);
// 		return res.status(400).json({ error: err.message });
// 	}

// 	const result = await Customer.findOne({ email: customerData.email });
// 	if (result) {
// 		const err = new CustomerNotFound(
// 			'Customer with this email already exists in the database'
// 		);
// 		return res.status(err.status).json({
// 			error: err.message,
// 		});
// 	}

// 	// const customer = await customerController.create(customerData);
// 	let customer = new Customer({
// 		name: cusotmerdata.name,
// 		email: cusotmerdata.email,
// 		phone: cusotmerdata.phone,
// 		isGold: cusotmerdata.isGold,
// 	});

// 	customer = await customer.save();
// 	return res.status(200).json({ customer });
// });

// router.put(
// 	'/:id',
// 	[userAuthenticated, isAdmin, validateObjectId],
// 	async (req, res) => {
// 		const { id } = req.params;
// 		const customerData = _.pick(req.body, ['name', 'email', 'phone', 'isGold']);
// 		const { error } = validateCustomer(customerData);
// 		if (error) {
// 			const err = new BadRequest(error.details[0].message);

// 			logger.error(error.message);
// 			return res.status(err.status).json({ error: err.message });
// 		}
// 		const { name, email, phone, isGold } = customerData;
// 		const customerUpdate = await Customer.findByIdAndUpdate(
// 			id,
// 			{
// 				$set: {
// 					name,
// 					email,
// 					phone,
// 					isGold,
// 				},
// 			},
// 			{ new: true }
// 		);

// 		return res.status(200).json({ customerUpdate });
// 	}
// );

// // to delete a specific customer from the database
// router.delete(
// 	'/:id',
// 	[userAuthenticated, isAdmin, validateObjectId],
// 	async (req, res) => {
// 		const { id } = req.params;

// 		const deletedCustomer = await Customer.findByIdAndRemove(id);
// 		logger.info(deletedCustomer);

// 		if (!deletedCustomer) {
// 			logger.info(deletedCustomer);
// 			const err = new CustomerNotFound(
// 				'Customer not found in the database. This resource must have been deleted already or did not exist in the database.'
// 			);

// 			logger.error(error.message);
// 			return res.status(err.status).json({
// 				error: err.message,
// 			});
// 		}

// 		return res.status(200).json({ deletedCustomer });
// 	}
// );

// // delete all customers from the database
// router.delete('/', [userAuthenticated, isAdmin], async (req, res) => {
// 	const deletedData = await Customer.deleteMany();

// 	if (!deletedData) {
// 		logger.info(deletedData);
// 		const err = new CustomerNotFound(
// 			'No data found to delete. The database contains no customers.'
// 		);

// 		logger.error(error.message);
// 		return res.status(err.status).json({
// 			err: err.message,
// 		});
// 	}

// 	return res.status(200).json(deletedData);
// });
