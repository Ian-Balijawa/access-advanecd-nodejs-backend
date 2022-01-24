class ProductNotFound {
	constructor(msg) {
		this.name = 'ProductNotFound';
		this.message = msg || 'Product Not Found!';
		this.code = 1000;
		this.status = 404;
	}
}
ProductNotFound.prototype = Error.prototype;
module.exports.ProductNotFound = ProductNotFound

