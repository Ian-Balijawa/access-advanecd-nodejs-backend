const jwt = require('jsonwebtoken');
const { ForbiddenService } = require('../errors/api.error');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  const userPayLoad = jwt.decode(token);

  if (!req.user || !req.user.isAdmin || !userPayLoad.isAdmin) {
    const httpError = new ForbiddenService(
      'Forbidden! Access to the required resource id denied. Contact an admin to elevate your privileges'
    );
    return res.status(httpError.status).json({
      error: httpError.message,
    });
  }

  next();
};
