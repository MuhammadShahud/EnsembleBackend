/* eslint-disable prettier/prettier */
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { surveyService } = require("../services");
const pick = require("../utils/pick");

const createSurvey = catchAsync(async (req, res) => {
  const response = await surveyService.createSurvey(req.body);
  console.log("response --> ", response);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Survey has been created", response });
});

const getSurveys = catchAsync(async (req, res) => {
  console.log("req", req);
  const result = await surveyService.getSurveys(req);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Got all Surveys", result });
});

const updateSurvey = catchAsync(async (req, res) => {
  const result = await surveyService.updateSurvey(req.params.id, req.body);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Survey has been updated", result });
});


module.exports = {
      createSurvey,
      getSurveys,
      updateSurvey,
};
