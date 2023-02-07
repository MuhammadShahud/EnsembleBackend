/* eslint-disable prettier/prettier */
const { Notification } = require("../models");
const { Token } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const admin = require("firebase-admin");
const { userService } = require("./index");

const createNoti = async (req) => {
  const noti = await Notification.create(req);
  const res = await getTokenById("638e8e677bb5e473f75d062c");
  console.log("asjidjasiodjas", res.token);
  const tokens = res.token;
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
  const response = await Token.find({companyId : id });
  return response;
};

const updateToken = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const user = await userService.getUserById(id);
  const userObj = {
    token:update.token
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  let newToken;
  const token = await getTokenById(update.companyId).then(async(res)=>{
    console.log("tokennnn",update, res[0].token);
    !res[0].token.includes(update.token) ? res[0].token.push(update.token) :
    null
    console.log("newToken",res[0].token);
    newToken = {
      token : res[0].token
    }
  });

  Object.assign(token, newToken);
  await token.save();
  Object.assign(user, userObj);

  await user.save();
  return user;  
};

module.exports = {
  createToken,
  getTokens,
  getTokenById,
  updateToken,
  createNoti,
  getNoti,
};
