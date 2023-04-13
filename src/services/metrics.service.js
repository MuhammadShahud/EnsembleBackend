/* eslint-disable prettier/prettier */
const { Metrics } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const surveyService = require("./survey.service");
const fixedSurveyService = require("./fixedSurvey.service");
const { notiService } = require("./index");

const createMetrics = async (body) => {
  const obj = {
    metrics: body.metrics,
  };
  let noti = {
    title: body.title,
    text: "Start a New Survey",
    navigate: "Surveys",
    companyId: body.companyId,
    type: "Surveys",
  };
  let array = [];
  let metrics;
  const fixedSurveys = await fixedSurveyService
    .paginateSurveys(obj, [])
    .then(async (r) => {
      await notiService.createNoti(noti.companyId, noti);
      r.results.forEach(async (e, i) => {
        console.log("for");
        const object = {
          metrics: e.metrics,
          question: e.question,
          companyId: body.companyId,
        };
        const survey = await surveyService
          .createSurvey(object)
          .then(async (s) => {
            console.log("then");

            array.push(s.id);

            if (array.length === 5) {
              body.surveyId = array;
              console.log("detailll", i, r.results.length, array, body);
              metrics = await Metrics.create(body);
            }
          });
      });
    });
  return metrics;
};

const getMetricsById = async (id) => {
  const team = await Metrics.findById(id).populate("surveyId");
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Metrics not found");
  }
  return team;
};

const getMetrics = async (body) => {
  const products = Metrics.find({ companyId: body }).populate("surveyId");
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
  console.log("Aaaaaaaaa", sAgree, total);

  console.log("perc", Math.floor(sAgree / total));
  metrics.score = Math.floor(sAgree / total);
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
