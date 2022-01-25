const jwt = require('jsonwebtoken');
const config = require('config');
const { BadRequest, Unauthorized } = require('../errors/api.error');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    const httpError = new Unauthorized(
      'Access deined. No token provided. This client might be logged out'
    );

    return res.status(httpError.status).json({ error: httpError.message });
  }
  try {
    const payLoad = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = payLoad;
    next();
  } catch (error) {
    const httpError = new BadRequest(
      'Invalid token provided!. Please provide a valid jsonwebtoken'
    );

    return res.status(httpError.status).json({
      error: httpError.message,
    });
  }
};
