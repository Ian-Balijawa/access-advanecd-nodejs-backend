const express = require("express");
const router = express.Router();

const {signUp} = require("../controllers/user");

router.post('/', signUp);

module.exports = router;

// async (req, res) => {
// 	const { validatationError } = validateUserPayLoad(req.body);

// 	console.log(validatationError);

// 	if (validatationError) {
// 		const error = new BadRequest(validatationError.details[0].message);

// 		logger.error(error.message);
// 		return res.status(error.status).json({
// 			error: error.message,
// 		});
// 	}

// 	// TODO: register a user

// 	user = await user.save();

// 	logger.debug(user);

// 	const token = user.generateAuthToken();
// 	user = _.pick(user, ['id', 'name', 'email']);
// 	logger.debug(token);

// 	logger.info('user', user);
// 	return res.set('x-auth-token', token).status(200).json({ user });
// };