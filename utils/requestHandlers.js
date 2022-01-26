const {logger} = require("./logger");

exports.handleResponse = ({
	res,
	statusCode = 200,
	msg = 'Success',
	data = {},
	result = 1,
}) => {
	//logger.info(msg,JSON.stringify(data));
	res.status(statusCode).send({ result: result, msg: msg, data: data });
};

exports.handleError = ({
	res,
	statusCode = 500,
	err = 'error',
	result = 0,
}) => {
	logger.error(err);
	if (err.code == 11000) {
		statusCode = 400;
		let keyName = 'some arbitary key';
		let matches = err.message.match(/index:(.*)_1/);
		if (matches) keyName = matches[1];
		err = `'${keyName}' can not be duplicate`;
	}
	res
		.status(statusCode)
		.send({ result, msg: err instanceof Error ? err.message : err.msg || err });
};
