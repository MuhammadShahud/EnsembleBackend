const httpStatus = require('http-status');
const { userService} = require('../services');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  // const mail =await mailService.
  res.status(httpStatus.CREATED).send(user);
});

// const deleteUser = catchAsync(async (req, res) => {
//   const user = await userService.deleteUserById(req.params.id);
//   res.status(200).send(user);
// });

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).send(user);
  //res.status(200).json("chal puttar tu chutti kar");
});

const updateUserById = catchAsync(async (req, res) => {
  const result = await userService.updateUserById(req.params.id, req.body);
  res.send(result);
});

const resetUser = catchAsync(async (req, res) => {
  const result = await userService.resetUser(req.body);
  res.send(result);
});




module.exports = {
  createUser,
  // deleteUser,
  getUserById,
  resetUser,
  updateUserById,
};
