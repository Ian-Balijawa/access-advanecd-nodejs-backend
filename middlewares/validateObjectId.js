const mongoose = require('mongoose');
const { BadRequest } = require('../errors/api.error');

module.exports = function (req, res, next) {
  const { id } = req.params || req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const httpError = new BadRequest(
      'Resource with the given id not found. Check that this a valid id'
    );
    return res.status(httpError.status).json({ error: httpError.message });
  }
  next();
};
