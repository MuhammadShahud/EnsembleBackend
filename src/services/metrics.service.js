/* eslint-disable prettier/prettier */
const { Metrics } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");

const createMetrics = async (body) => {
  const metrics = await Metrics.create(body);
  return metrics;
};

const getMetricsById = async (id) => {
  const team = await Metrics.findById(id)
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Metrics not found");
  }
  return team;
};

const getMetrics = async (filter, options) => {
    const products = Metrics.paginate(filter, options);
    return products;
};

const updateMetricsById = async (userId, updateBody) => {
  const metrics = await getMetricsById(userId);
  if (!metrics) {
    throw new ApiError(httpStatus.NOT_FOUND, "Metrics not found");
  }
  let total = 0;
  let sAgree = 0;
  updateBody.surveys.forEach((e) => {
    sAgree = sAgree + e.response.filter((f) => f === 5).length;
    total = total + e.response.length;
  });
  metrics.score = Math.floor(sAgree / total * 100);
  Object.assign(metrics, updateBody);
  console.log('metrics',metrics,updateBody);
  await metrics.save();
  return metrics;
};
module.exports = {
  createMetrics,
  getMetricsById,
  updateMetricsById,
  getMetrics,
};
