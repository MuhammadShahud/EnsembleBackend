/* eslint-disable prettier/prettier */
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { webNotiService } = require("../services");
const pick = require("../utils/pick");

const createNoti = catchAsync(async (req, res) => {
  const response = await webNotiService.createNoti(
    req.body.companyId,
    req.body
  );
  console.log("response --> ", response);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Noti has been created", response });
});

const getNoti = catchAsync(async (req, res) => {
  console.log("req", req);
  const filters = pick(req.query, ["companyId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await webNotiService.getNoti(filters, options);
  res.status(httpStatus.CREATED).send({ message: "Got all Noti", result });
});

module.exports = {
  createNoti,
  getNoti,
};
