class APIException {
  constructor(msg) {
    this.name = "APIException";
    this.message =
      msg ||
      "APIException. Internal Server Error- Something went fundamentaly wrong with the server";
    this.code = 5000;
    this.status = 500;
  }
}
APIException.prototype = Error.prototype;

class Unauthorized {
  constructor(msg) {
    this.name = "Unauthorized";
    this.message =
      msg ||
      "Unauthorised. You currently don't have sufficient priveleges to access this resource";
    this.code = 5001;
    this.status = 401;
  }
}
Unauthorized.prototype = Error.prototype;

class ServiceNotFound {
  constructor(msg) {
    this.name = "ServiceNotFound";
    this.message = msg || "Service not found :(";
    this.code = 5002;
    this.status = 404;
  }
}
ServiceNotFound.prototype = Error.prototype;

class ForbiddenService {
  constructor(msg) {
    this.name = "ServiceForbidden";
    this.message =
			msg ||
			"We see that you're userAuthenticatedd, but your're not an admin, so you're Forbidden from accessing this resource :(";
    this.code = 5003;
    this.status = 403;
  }
}
ForbiddenService.prototype = Error.prototype;

class BadRequest {
  constructor(msg) {
    this.name = "BadRequest";
    this.message = msg || "Bad request";
    this.code = 5004;
    this.status = 400;
  }
}
BadRequest.prototype = Error.prototype;

module.exports = {
  BadRequest,
  APIException,
  ForbiddenService,
  ServiceNotFound,
  Unauthorized,
};
