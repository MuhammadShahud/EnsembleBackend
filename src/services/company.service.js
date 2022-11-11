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
  const company = await Company.findById(id).populate("employeeId");
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  return company;
};

const updateCompanyById = async (userId, updateBody) => {
  const company = await getCompanyById(userId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  Object.assign(company, updateBody);
  await company.save();
  return company;
};
module.exports = {
  createCompany,
  getCompanyById,
  updateCompanyById,
};
