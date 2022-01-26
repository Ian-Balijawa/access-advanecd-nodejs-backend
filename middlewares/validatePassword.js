const { BadRequest } = require('../errors/api.error');
const { getUserWithHashedPassword } = require('../services/user');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
	const { password, email } = req.body;
	const user = await getUserWithHashedPassword(email, (fieldName = 'email'));

	const validPasswword = await bcrypt.compare(password, user.password);

	if (!validPasswword) {
		const httpError = new BadRequest('Invalid email or password');

		return res.status(httpError.status).json({ error: httpError.message });
	}
	next();
};
