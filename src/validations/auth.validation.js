const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
  }),
};

const login = {
  body: Joi.object().keys({
    orderId: Joi.string(),
    token: Joi.string(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  login,
  logout,
  register,
};
