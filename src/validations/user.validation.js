const Joi = require('joi');
const {password, objectId} = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
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

module.exports = {
  getUser,
  getUsers,
  createUser,
};
