/* eslint-disable prettier/prettier */
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { notiService } = require("../services");
const pick = require("../utils/pick");

const createNoti = catchAsync(async (req, res) => {
      const response = await notiService.createNoti(req.body);
      console.log("response --> ", response);
      res
        .status(httpStatus.CREATED)
        .send({ message: "Noti has been created", response });
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
  res
    .status(httpStatus.CREATED)
    .send({ message: "Got all Tokens", result });
});

const updateToken = catchAsync(async (req, res) => {
  const result = await notiService.updateToken(req.params.id, req.body);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Token has been updated", result });
});


module.exports = {
      createToken,
      getTokens,
      updateToken,
      createNoti
};
