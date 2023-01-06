const httpStatus = require("http-status");
const { User } = require("../models");
const { update } = require("../models/user.model");
const ApiError = require("../utils/APIError");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (userBody) => {
  console.log((await User.find({ orderId: userBody.orderId })).length);
  if ((await User.find({ orderId: userBody.orderId })).length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already taken");
  } else {
    const user = await User.create(userBody);
    return user;
  }
};

const postPic = async (userId, file) => {
  console.log("working", file);
  const user = await getUserById(userId);
  const newUser = {
    profilePic: file.path,
  };
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  Object.assign(user, newUser);
  await user.save();
  return user;
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
  const users = await User.paginate(filter, options);
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
const getUserById = async (id) => {
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
      token: token,
    },
    { new: true }
  );
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
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const changePassword = async (req, res) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;

  const isUser = await getUserById(req.params.id);
  try {
    if (newPassword === confirmPassword) {
      console.log("cond");

      bcrypt
        .compare(oldPassword, isUser.password)
        .then(async (isMatch) => {
          console.log("isMatch");
          if (isMatch) {
            console.log("isMatch2");
            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(newPassword, salt, function (err, hash) {
                console.log("hash");
                if (err) throw err;
                isUser.password = hash;
             
              });
            });
            const result = await updateUserById(
              isUser._id,
              isUser
            );
            return res
              .status(200)
              .json({
                message: "password Changed Successfully",
                user: result,
              });
          }else{
          console.log("isMatch3");

          return res.status(400).json({
            errors: [{ message: "Wrong Old Password" }],
          });
        }
        })

        .catch((err) => {
          res.status(500).json({ erros: err });
          console.log("err3");
        });
    } else {
      return res
        .status(400)
        .json({ message: "password and confirm password does not match" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  postPic,
  queryUsers,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  changePassword,
};
