/* eslint-disable prettier/prettier */
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { metricsService } = require("../services");
const pick = require("../utils/pick");

const createMetrics = catchAsync(async (req, res) => {
  const response = await metricsService.createMetrics(req.body);
  console.log("response --> ", response);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Metrics has been created", response });
});

const getMetrics = catchAsync(async (req, res) => {
  console.log("req", req);
  const result = await metricsService.getMetrics(
     req.body
  );
  res
    .status(httpStatus.CREATED)
    .send({ message: "Got all Metrics", result });
});

const updateMetrics = catchAsync(async (req, res) => {
  const result = await metricsService.updateMetricsById(req.params.id, req.body);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Metrics has been updated", result });
});


module.exports = {
      createMetrics,
      getMetrics,
      updateMetrics,
};
