/* eslint-disable prettier/prettier */
const { Survey } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const { userService } = require("./index");

const createSurvey = async (body) => {
  const survey = await Survey.create(body);
  return survey;
};

const getSurveys = async (req) => {
  console.log(req);
  const products = Survey.find({ companyId: req });
  return products;
};

const getSurveyById = async (id) => {
  const response = await Survey.findById(id);
  return response;
};

const updateSurvey = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const survey = await getSurveyById(id);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, "Survey not found.");
  }
  let total = 0;
  let s5 = 0;
  let s4 = 0;
  let s3 = 0;
  let s2 = 0;
  let s1 = 0;

  s5 = update.update.response.filter((f) => f === 5).length;
  total = update.update.response.length;
  survey.score5 = Math.floor((s5 / total) * 100);

  s4 = update.update.response.filter((f) => f === 4).length;
  total = update.update.response.length;
  survey.score4 = Math.floor((s4 / total) * 100);
  
  s3 = update.update.response.filter((f) => f === 3).length;
  total = update.update.response.length;
  survey.score3 = Math.floor((s3 / total) * 100);

  s2 = update.update.response.filter((f) => f === 2).length;
  total = update.update.response.length;
  survey.score2 = Math.floor((s2 / total) * 100);

  s1 = update.update.response.filter((f) => f === 1).length;
  total = update.update.response.length;
  survey.score1 = Math.floor((s1 / total) * 100);
  const user = await userService.getUserById(update.user.id);
  console.log('newCompany',user.completedSurveys);

  const obj = {
    completedSurveys : user.completedSurveys
  }
  obj.completedSurveys.push(survey.id)
  const newCompany = await userService.updateUserById(update.user.id,obj);
  Object.assign(survey, update.update);
  await survey.save();

  return newCompany;
};

module.exports = {
  createSurvey,
  getSurveys,
  updateSurvey,
};
