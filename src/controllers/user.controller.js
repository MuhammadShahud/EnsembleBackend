const httpStatus = require('http-status');
const { userService} = require('../services');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const changePassword = catchAsync(async (req, res) => {
  const result = await userService.changePassword(req.body,req.params.id);
  res.status(httpStatus.CREATED).send(result);
});

const postPic = catchAsync(async (req, res) => {
  console.log('req.file',req.file);
  const user = await userService.postPic(req.params.id,req.file);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['front', 'premium','setId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(
    filters,
    options,
  );
  res.status(httpStatus.CREATED).send(result);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(httpStatus.CREATED).send(user);
  //res.status(200).json("chal puttar tu chutti kar");
});

const updateUserById = catchAsync(async (req, res) => {
  const result = await userService.updateUserById(req.params.id, req.body);
  res.status(httpStatus.CREATED).send(result);
});






module.exports = {
  createUser,
  postPic,
  getUserById,
  updateUserById,
  changePassword
};
