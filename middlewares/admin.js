module.exports = function (req, res, next) {
	if (!req.user.isAdmin)
		return res.sendStatus(403).json({
			message:
				'Forbidden! Access to the required resource id denied. Contact an admin to elevate your privileges',
		});

	next();
};
