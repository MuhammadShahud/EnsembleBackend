/* eslint-disable prettier/prettier */
const { Notification } = require("../models");
const { Token } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const admin = require("firebase-admin");

const createNoti = async (req) => {
  const noti = await Notification.create(req);
  const res = await getTokenById("638e8e677bb5e473f75d062c");
  console.log("asjidjasiodjas",res.token);
const tokens = res.token;
  console.log("tokens", tokens);
  const { title, text } = req;
  const body = text;
 const firebase = req.navigate? await admin.messaging().sendMulticast({
    tokens,
    notification: {
      title,
      body,
    },
   data: {
type:req.navigate
 }
  }): await admin.messaging().sendMulticast({
    tokens,
    notification: {
      title,
      body,
    },
 
  })

  return firebase;
};

const getNoti = async (req) => {
  const products = Notification.find();
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
  const response = await Token.findById(id);
  return response;
};

const updateToken = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const token = await getTokenById(id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, "token not found.");
  }
  if(!token.token.includes(update.token)){
  token.token.push(update.token)
  }
  await token.save();
  return token;
};

module.exports = {
  createToken,
  getTokens,
  getTokenById,
  updateToken,
  createNoti,
  getNoti
};
