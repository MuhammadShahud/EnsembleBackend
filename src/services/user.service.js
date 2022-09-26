const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/APIError');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */


const createUser = async userBody => {
  console.log((await User.find({ orderId: userBody.orderId })).length)
  if ((await User.find({ orderId: userBody.orderId })).length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already taken');
  } else {
    const user = await User.create(userBody);
    return user;
  }
};


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options, 'customer_id');
  return users;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async id => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email, token) => {
  return User.findOneAndUpdate(
    { email },
    {
      token: token
    },
    { new: true }
  )
};

const getUserByCustomerId = async customer_id => {
  return User.findOne({ customer_id: customer_id });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUserByCustomerId = async (customer_id, updateBody) => {
  const user = await getUserByCustomerId(customer_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async userId => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const deleteUserByCustomerId = async customer_id => {
  const user = await getUserByCustomerId(customer_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};


module.exports = {
  createUser,
  queryUsers,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByCustomerId,
  updateUserById,
  updateUserByCustomerId,
  deleteUserById,
  deleteUserByCustomerId,
};
