const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/APIError");
const path = require("path");
const bcrypt = require("bcrypt");
const companyService = require("../services/company.service");

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

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email, token) => {
  return User.findOneAndUpdate(
    { email },
    {
      token: token,
    },
    { new: true }
  );
};
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

  const company = await companyService.getCompanyById(user.companyId);
  console.log("newCompany", company.employeeId);

  const array = company.employeeId.filter((e) => e !== user.id);
  const obj = {
    employeeId: array,
  };
  const newCompany = await companyService.updateCompanyById(
    user.companyId,
    obj
  );
  console.log("newCompany", newCompany);
  return "Employee has been deleted";
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
            bcrypt.compare(newPassword, isUser.password).then(async (match) => {
              if (match) {
                return res.status(400).json({
                  errors: [{ message: "You should try something deiffent" }],
                });
              } else {
                bcrypt.genSalt(10, function (err, salt) {
                  bcrypt.hash(newPassword, salt, async function (err, hash) {
                    console.log("hash", isUser.password, hash);
                    if (err) throw err;
                    isUser.password = hash;
                    console.log("isUser.password", isUser.password);
                    const result = await updateUserById(isUser._id, isUser);
                    return res.status(200).json({
                      message: "password Changed Successfully",
                      user: result,
                    });
                  });
                });
              }
            });
          } else {
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
