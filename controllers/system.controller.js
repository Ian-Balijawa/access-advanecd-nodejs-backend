const { System: SystemModel } = require('../models/system.model');

const systemController = {};

systemController.createSystem = (systemData) => {
	return new Promise((resolve, reject) => {
		let newSystem = new SystemModel();
		const { name, price, version, description, size, lastUpdate } =
			systemData;

		newSystem = {
			name,
			price,
			version,
			description,
			size,
			lastUpdate,
		};
		SystemModel.create(newSystem)
			.then((systemInstance) => {
				systemInstance = systemInstance.toObject();
				systemInstance.systemId = systemInstance._id;

				delete systemInstance._id;
				delete systemInstance._v;

				resolve(systemInstance);
			})
			.catch((err) => reject(err));
	});
};

module.exports = systemController;
