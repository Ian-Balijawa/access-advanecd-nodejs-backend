const { APIException } = require('../errors/api.error');

module.exports = function (err, req, res, next) {
  const httpError = new APIException();
  res.status(httpError.status).json({ error: httpError.message });
  next();
};
