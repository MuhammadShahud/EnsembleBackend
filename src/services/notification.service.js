/* eslint-disable prettier/prettier */
const { Notification } = require("../models");
const { Token } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const admin = require("firebase-admin");
const  userService  = require("../services/user.service");

const createNoti = async (id, req) => {
  const noti = await Notification.create(req);
  const res = await getTokenById(id);
  console.log("asjidjasiodjas", res[0]);
  const tokens = res[0].token;
  console.log("tokens", tokens);
  const { title, text } = req;
  const body = text;
  const firebase = req.navigate
    ? await admin.messaging().sendMulticast({
        tokens,
        notification: {
          title,
          body,
        },
        data: {
          type: req.navigate,
        },
      })
    : await admin.messaging().sendMulticast({
        tokens,
        notification: {
          title,
          body,
        },
      });

  return firebase;
};

const getNoti = async (filter, options) => {
  const products = Notification.paginate(filter, options);
  return products;
};

const createToken = async (body) => {
  const tokens = await Token.create(body);
  return tokens;
};

const getTokens = async (req) => {
  const products = Token.find();
  return products;
};

const getTokenById = async (id) => {
  const response = await Token.find({ companyId: id });
  return response;
};







module.exports = {
  createToken,
  getTokens,
  getTokenById,
  createNoti,
  getNoti,
  
};
