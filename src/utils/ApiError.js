const errorTypes = require('../config/errors');

class ApiError extends Error {
  constructor(error, isOperational = true, stack = '') {
    let errorObj = {};
    // console.log(error);
    // console.log(errorTypes[error]);
    if (typeof error === 'object') {
      errorObj = error;
    } else if (errorTypes[error] === undefined) {
      errorObj = errorTypes.unknownError;
      errorObj.type = 'unknownError';
    } else {
      errorObj = errorTypes[error];
      errorObj.type = error;
    }

    super(errorObj.message);
    this.name = errorObj.type;
    this.statusCode = errorObj.statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
