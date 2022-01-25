const customerValidator = require('../validations/customer');
const productValidator = require('../validations/product');
const saleValidator = require('../validations/sale');
const userValidator = require('../validations/User');
const { BadRequest } = require('../errors/api.error');

/**
 *
 * @param {RequsetObject} req
 * @param {ResponseObject} res
 * @param {()=>(req,res)} next
 * @returns {()=>(req,res)} next
 */
module.exports.validateCustomerPayLoad = function (req, res, next) {
	const { validationError } = customerValidator(req.body);

	if (validationError) {
		const httpError = new BadRequest(validationError.details[0].message);

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}
	next();
};

/**
 *
 * @param {RequsetObject} req
 * @param {ResponseObject} res
 * @param {()=>(req,res)} next
 * @returns {()=>(req,res)} next
 */
module.exports.validateUserPayLoad = function (req, res, next) {
	const { validationError } = userValidator(req.body);

	if (validationError) {
		const httpError = new BadRequest(validationError.details[0].message);

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}
	next();
};

/**
 *
 * @param {RequsetObject} req
 * @param {ResponseObject} res
 * @param {()=>(req,res)} next
 * @returns {()=>(req,res)} next
 */
module.exports.validateProductPayLoad = function (req, res, next) {
	const { validationError } = productValidator(req.body);

	if (validationError) {
		const httpError = new BadRequest(validationError.details[0].message);

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}
	next();
};

/**
 *
 * @param {RequsetObject} req
 * @param {ResponseObject} res
 * @param {()=>(req,res)} next
 * @returns {()=>(req,res)} next
 */
module.exports.validateSalePayLoad = function (req, res, next) {
	const { validationError } = saleValidator(req.body);

	if (validationError) {
		const httpError = new BadRequest(validationError.details[0].message);

		logger.error(httpError.message);

		return res.status(httpError.status).json({
			error: httpError.message,
		});
	}
	next();
};
