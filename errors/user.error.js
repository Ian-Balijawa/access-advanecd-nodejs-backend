class UserNotFound {
	constructor(msg) {
		this.name = 'UserNotFound';
		this.message = msg || 'User Not Found!';
		this.code = 1000;
		this.status = 404;
	}
}
UserNotFound.prototype = Error.prototype;
module.exports.UserNotFound = UserNotFound

