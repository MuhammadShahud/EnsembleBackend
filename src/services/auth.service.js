const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/APIError");
const { tokenTypes } = require("../config/tokens");
const { User } = require('../models/index')

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (orderId, token) => {
  const response = await User.updateOne(
    { orderId: orderId },
    { $set: { "token": token } }
    );
  const user = await User.find({ orderId: orderId });

  if (user.length == 0 ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "No subscription has found");
  } 

  return user[0];
};
 
module.exports = {
  loginUserWithEmailAndPassword,
};
