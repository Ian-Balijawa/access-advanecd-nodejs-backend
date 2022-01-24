const mongoose = require('mongoose');
const BadRequest = require('../errors/system.error');

module.exports = function (req, res, next) {
	const { id } = req.params || req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new BadRequest(
			'Resource with the given id not found. Check that this a valid id'
		);
		return res.sendStatus(error.status).json({ error: error.message });
	}
	next();
};
