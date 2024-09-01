class CustomError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends CustomError {
  constructor (message) {
    super(message, 400)
  }
}

class AuthenticationError extends CustomError {
  constructor (message) {
    super(message, 401)
  }
}

class AuthorizationError extends CustomError {
  constructor (message) {
    super(message, 403)
  }
}

class DatabaseError extends CustomError {
  constructor (message) {
    super(message, 500)
  }
}

module.exports = {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError
}