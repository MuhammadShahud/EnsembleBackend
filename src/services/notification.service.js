/* eslint-disable prettier/prettier */
const { Notification, Company, User } = require("../models");
const { Token } = require("../models");
var mongoose = require("mongoose");
const admin = require("firebase-admin");

const createNoti = async (id, req) => {
  const noti = await Notification.create(req);
  const res = await getTokenById(id);
  console.log("asjidjasiodjas", res[0]);
  const tokens = res[0].token;
  console.log("tokens", tokens);
  const { title, text } = req;
  const body = text;
  const firebase = req.navigate
    ? await admin
        .messaging()
        .sendMulticast({
          tokens,
          notification: {
            title,
            body,
          },
          data: {
            type: req.navigate,
          },
        })
        .then(async (r) => {
          const obj = {
            noti: true,
          };
          const company = await Company.findById(id);
          console.log("company", company.employeeId);

          company.employeeId.forEach(async (e) => {
            const user = await User.findById(e);
            console.log("user", user);
            Object.assign(user, obj);
            await user.save();
          });
        })
    : await admin
        .messaging()
        .sendMulticast({
          tokens,
          notification: {
            title,
            body,
          },
        })
        .then(async (r) => {
          const obj = {
            noti: true,
          };
          const company = await Company.findById(id);
          console.log("company", company.employeeId);

          company.employeeId.forEach(async (e) => {
            const user = await User.findById(e);
            console.log("user", user);
            Object.assign(user, obj);
            await user.save();
          });
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
