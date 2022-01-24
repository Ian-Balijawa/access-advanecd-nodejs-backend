class SaleNotFound {
    constructor(msg) {
        this.name = 'SaleNotFound';
        this.message = 'Sale Not Found!';
        this.code = 2000;
        this.status = 404;
    }
}
SaleNotFound.prototype = Error.prototype;
module.exports.SaleNotFound = SaleNotFound;

