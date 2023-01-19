/* eslint-disable prettier/prettier */
const { Metrics } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const surveyService = require("./survey.service");
const fixedSurveyService = require("./fixedSurvey.service");

const createMetrics = async (body) => {
  const obj = {
    metrics: body.metrics,
  };
  let array = [];
  let metrics;
  const fixedSurveys = await fixedSurveyService
    .paginateSurveys(obj, [])
    .then((r) => {
      r.results.forEach(async (e, i) => {
        const object = {
          question: e.question,
          companyId: body.companyId
        };
        const survey = await surveyService.createSurvey(object);
        console.log("starttt", survey.id);
        array.push(survey.id);

        if (i === r.results.length - 1) {
          body.surveyId = array;
          metrics = await Metrics.create(body);
          console.log("enndddd", metrics, array, r);
        }
      });
    });
    return metrics;
};

const getMetricsById = async (id) => {
  const team = await Metrics.findById(id).populate('surveyId');
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Metrics not found");
  }
  return team;
};

const getMetrics = async (body) => {
  const products = Metrics.find({companyId:body.companyId}).populate('surveyId');
  return products;
};

const updateMetricsById = async (userId, updateBody) => {
  const metrics = await getMetricsById(userId);
  if (!metrics) {
    throw new ApiError(httpStatus.NOT_FOUND, "Metrics not found");
  }
  let total = 0;
  let sAgree = 0;
  metrics.surveyId.forEach((e) => {
    sAgree = sAgree + e.score5;
    total = total + 1;

  });
  console.log("Aaaaaaaaa",sAgree,total);

  console.log("perc",Math.floor((sAgree / total)));
  metrics.score = Math.floor((sAgree / total) );
  Object.assign(metrics, updateBody);
  console.log("metrics", metrics, updateBody);
  await metrics.save();
  return metrics;
};
module.exports = {
  createMetrics,
  getMetricsById,
  updateMetricsById,
  getMetrics,
};
