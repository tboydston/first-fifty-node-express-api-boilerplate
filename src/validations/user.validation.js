const Joi = require('joi');
const { password, objectId, userName, buildUserKey } = require('./custom.validation');

const createUserKey = buildUserKey();
createUserKey.role = Joi.string().required().valid('user', 'admin');

const createUser = {
  body: Joi.object().keys(createUserKey),
};

const getUsers = {
  query: Joi.object().keys({
    email: Joi.string().email(),
    userName: Joi.string().custom(userName),
    firstName: Joi.string(),
    lastName: Joi.string(),
    company: Joi.string(),
    mfaType: Joi.string(),
    mfaStatus: Joi.string(),
    isEmailVerified: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      userName: Joi.string().custom(userName),
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      lastName: Joi.string(),
      company: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
