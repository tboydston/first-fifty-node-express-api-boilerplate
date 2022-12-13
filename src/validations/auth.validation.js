const Joi = require('joi');
const { password, buildUserKey } = require('./custom.validation');

const register = {
  body: Joi.object().keys(buildUserKey()),
};

const login = {
  body: Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const enableMfa = {
  body: Joi.object().keys({
    mfaType: Joi.string().required().valid('totp'),
  }),
};

const verifyMfa = {
  body: Joi.object().keys({
    mfaToken: Joi.string().required(),
  }),
};

const disableMfa = {
  body: Joi.object().keys({
    mfaToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyMfa,
  enableMfa,
  disableMfa,
};
