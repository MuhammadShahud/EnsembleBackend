/* eslint-disable prettier/prettier */
const { WebNoti } = require("../models");
const admin = require("firebase-admin");
const { updateCompanyById } = require("./company.service");

const createNoti = async (id, req) => {
  const noti = await WebNoti.create(req);
  const obj = {
    webNoti: true,
  };
  updateCompanyById(req.companyId, obj);
  return noti;
};

const getNoti = async (filter, options) => {
  const products = WebNoti.paginate(filter, options);
  return products;
};

module.exports = {
  createNoti,
  getNoti,
};
