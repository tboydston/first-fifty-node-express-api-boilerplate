const httpStatus = require('http-status');

const errorTypes = {
  unknownError: {
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    message: 'An unknown error has occured.',
  },
  unauthorized: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Please authenticate',
  },
  forbidden: {
    statusCode: httpStatus.FORBIDDEN,
    message: 'Forbidden',
  },
  notFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Any error',
  },
  anyError: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Not found',
  },
  resetPasswordInvalidEmail: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'No users found with this email',
  },
  userNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'User not found',
  },
  mfaNotEnabled: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'TOTP MFA has not been enabled for this account.',
  },
  invalidMfaToken: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'TOTP MFA token invalid or expired.',
  },
  mfaAlreadyEnabled: {
    statusCode: httpStatus.BAD_REQUEST,
    message:
      'MFA already enabled. To update MFA you must disable and then enable MFA again or if you no longer have access to your MFA device, contact support.',
  },
  mfaDisableFailed: {
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    message: 'Disable MFA failed',
  },
  emailTaken: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Email already taken',
  },
  userNameTaken: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Username already taken',
  },
  captchaInvalid: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Error validating captcha',
  },
  authInvalidEmailOrPassword: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Incorrect email or password',
  },
  authInvalidUserNameOrPassword: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Incorrect login or password',
  },
  authTokenNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Not found',
  },
  authRefreshTokenInvalid: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Refresh token invalid',
  },
  resetPasswordFailed: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Password reset failed',
  },
  emailVerificationFailed: {
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'Password reset failed',
  },
};

module.exports = errorTypes;
