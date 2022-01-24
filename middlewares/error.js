module.exports = function (err, req, res, next) {
	// error
	// warn
	// info -> default
	// verbose
	// debug
	// sily
	res.status(500).send(err);
	next();
};
