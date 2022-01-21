const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
	const token = req.header('X-auth-token');

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access deined. No token provided' });
	}
	try {
		const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'),);
		req.user = decodedToken;
		next();
	} catch (error) {
		return res.status(400).json({
			message:
				'Invalid token provided! . Please provide a valid jsonwebtoken',
		});
	}
};
