const httpStatusCodes = require("./httpStatusCodes")
const BaseError = require("./baseError")

class Api400Error extends BaseError {
  constructor(
    description,
    name = "Bad request.",
    statusCode = httpStatusCodes.BAD_REQUEST,
    isOperational = true
  ) {
    super(description, statusCode, name, isOperational)
  }
}

class Api401Error extends BaseError {
  constructor(
    description,
    name = "Unauthorized.",
    statusCode = httpStatusCodes.UNAUTHORIZED,
    isOperational = true
  ) {
    super(description, statusCode, name, isOperational)
  }
}

class Api403Error extends BaseError {
  constructor(
    description,
    name = "Forbidden.",
    statusCode = httpStatusCodes.FORBIDDEN,
    isOperational = true
  ) {
    super(description, statusCode, name, isOperational)
  }
}

class Api404Error extends BaseError {
  constructor(
    description,
    name = "Not found.",
    statusCode = httpStatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(description, statusCode, name, isOperational)
  }
}

class Api429Error extends BaseError {
  constructor(
    description,
    name = "Too many requests.",
    statusCode = httpStatusCodes.TOO_MANY_REQUESTS,
    isOperational = true
  ) {
    super(description, statusCode, name, isOperational)
  }
}

class Api500Error extends BaseError {
  constructor(
    description,
    name = "Internal server error.",
    statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = false
  ) {
    super(description, statusCode, name, isOperational)
  }
}

module.exports = {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api429Error,
  Api500Error,
}
