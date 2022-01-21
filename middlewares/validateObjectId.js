const mongoose = require('mongoose');

module.exports = function (req, res, next) {
	const { id } = req.params || req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.send(
				'Resource with the given id not found. Check that this a valid id'
			);
	}
	next();
};
