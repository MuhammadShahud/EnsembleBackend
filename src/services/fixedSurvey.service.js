/* eslint-disable prettier/prettier */
const { FixedSurvey } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");

const createSurvey = async (body) => {
  const survey = await FixedSurvey.create(body);
  return survey;
};

const getSurveys = async (req) => {
  const products = FixedSurvey.find();
  return products;
};

const paginateSurveys = async (filter,options) => {
  const products = FixedSurvey.paginate(filter,options);
  return products;
};

const getSurveyById = async (id) => {
  const response = await FixedSurvey.findById(id);
  return response;
};

const updateSurvey = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const survey = await getSurveyById(id);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, "Survey not found.");
  }
  Object.assign(survey, update);
  await survey.save();
  return survey;
};

module.exports = {
  createSurvey,
  getSurveys,
  updateSurvey,
  paginateSurveys
};
