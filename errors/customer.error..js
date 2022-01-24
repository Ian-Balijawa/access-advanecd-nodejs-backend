class CustomerNotFound {
	constructor(msg) {
		this.name = 'CustomerNotFound';
		this.code = 4000;
		this.message = msg || 'Customer Not Found!';
		this.status = 404;
	}
}

CustomerNotFound.prototype = Error.prototype;
module.exports.CustomerNotFound = CustomerNotFound
