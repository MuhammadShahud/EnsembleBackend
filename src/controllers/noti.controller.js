/* eslint-disable prettier/prettier */
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { notiService } = require("../services");
const pick = require("../utils/pick");
const notificationService  = require("../services/extraServices/noti.service");



const createNoti = catchAsync(async (req, res) => {
  const response = await notiService.createNoti(req.body.companyId,req.body);
  console.log("response --> ", response);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Noti has been created", response });
});

const getNoti = catchAsync(async (req, res) => {
  console.log("req", req);
  const filters = pick(req.query, ['companyId','type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await notiService.getNoti(
      filters,
      options,
  );
  // const result = await notiService.getNoti(req);
  res.status(httpStatus.CREATED).send({ message: "Got all Noti", result });
});

const createToken = catchAsync(async (req, res) => {
  const response = await notiService.createToken(req.body);
  console.log("response --> ", response);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Token has been created", response });
});

const getTokens = catchAsync(async (req, res) => {
  console.log("req", req);
  const result = await notiService.getTokens(req);
  res.status(httpStatus.CREATED).send({ message: "Got all Tokens", result });
});

const updateToken = catchAsync(async (req, res) => {
  const result = await notificationService.updateToken(req.params.id, req.body);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Token has been updated", result });
});

module.exports = {
  createToken,
  getTokens,
  updateToken,
  createNoti,
  getNoti,
};
