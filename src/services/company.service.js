/* eslint-disable prettier/prettier */
const { Company } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");

const createCompany = async (body) => {
  const company = await Company.create(body);
  return company;
};

const getCompanyById = async (id) => {
  console.log(mongoose.Types.ObjectId.isValid(id));
  const company = await Company.findById(id).populate("employeeId").populate('teamId');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  return company;
};

const updateCompanyById = async (userId, updateBody) => {
  console.log(mongoose.Types.ObjectId.isValid(userId));

  const company = await getCompanyById(userId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  Object.assign(company, updateBody);
  await company.save();
  return company;
};

const postPic = async (userId, file) => {
  console.log("working",file);
  const user = await getCompanyById(userId);
  const newUser = {
    profilePic: file.path
  
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, newUser);
  await user.save();
  return user;
};



module.exports = {
  createCompany,
  getCompanyById,
  updateCompanyById,
  postPic
};
