const Joi = require('joi');
const config = require('../config/config');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const userName = (value, helpers) => {
  if (value.length < 3 || value.length > 30 || !value.match(/^[a-zA-Z0-9_.]+$/)) {
    return helpers.message(`userName must be between 3 and 30 characters contain only '.' and '_'`);
  }
  return value;
};

const buildUserKey = () => {
  const key = {
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  };

  if (config.registration.requiredFields.includes('firstName')) {
    key.firstName = Joi.string().required();
  }

  if (config.registration.requiredFields.includes('lastName')) {
    key.lastName = Joi.string().required();
  }

  if (config.registration.requiredFields.includes('company')) {
    key.company = Joi.string().required();
  }

  if (config.registration.requiredFields.includes('userName')) {
    key.userName = Joi.string().required().custom(userName);
  }

  return key;
};

module.exports = {
  objectId,
  password,
  userName,
  buildUserKey,
};
