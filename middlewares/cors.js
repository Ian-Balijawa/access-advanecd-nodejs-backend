module.exports.CORS = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization',
		'Orign',
		'X-Requested-With',
		'Content-Type',
		'Accept'
	);
	res.methods(
		'Access-Control-Allow-Methods',
		'PUT,DELETE,PUT,POST,GET,OPTIONS'
	);
	if (req.methods == 'OPTIONS') {
		res.sendStatus(200).send();
	} else {
		next();
	}
};
