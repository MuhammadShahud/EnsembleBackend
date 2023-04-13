const { Notification, Company, User } = require("../../models");
const { Token } = require("../../models");
const ApiError = require("../../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const admin = require("firebase-admin");
var cron = require("node-cron");
const userService = require("../../services/user.service");

const getUserById = async (id) => {
  return User.findById(id);
};

const createGoalNoti = async (id, req, dueDate,companyId) => {
  const noti = await Notification.create(req);
  const user = await getUserById(id);
  console.log("asjidjasiodjas", user);
  const tokens = [user.token];
  console.log("tokens", tokens);
  const { title, text } = req;
  const body = text;

  const desiredDate = dueDate.split("T")[0].split("-");
  console.log("dueDate", desiredDate);

  const desiredYear = desiredDate[0];
  const desiredMonth = desiredDate[1] - 1; // November
  const desiredDay = desiredDate[2] - 1;
  const desiredHour = 1;
  const desiredMinute = 3;
  const desiredSecond = 0;

  const currentDate = new Date();

  const runDate = new Date(
    desiredYear,
    desiredMonth,
    desiredDay,
    desiredHour,
    desiredMinute,
    desiredSecond
  );
  console.log("dueDate", currentDate, runDate);

  let timeDifference = runDate - currentDate;

  timeDifference < 0 ? (timeDifference = 0) : null;

  console.log("timeDifference", timeDifference);
  let firebase;
  setTimeout(async () => {
    firebase = await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data: {
        type: req.navigate,
      },
    }) .then(async (r) => {
      const obj = {
        noti: true,
      };
      const company = await Company.findById(companyId);
      console.log("company", company.employeeId);

      company.employeeId.forEach(async (e) => {
        const user = await User.findById(e);
        console.log("user", user);
        Object.assign(user, obj);
        await user.save();
      });
    })
    console.log("setTimeout working", firebase);
  }, timeDifference);

  return firebase;
};
const updateTokenById = async (id, update) => {
  const token = await getTokenByIdd(id);
  console.log("token", token, id);

  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  console.log("token", token, update);
  Object.assign(token, update);
  await token.save();
};
const getTokenByIdd = async (id) => {
  const response = await Token.findById(id);
  return response;
};
const getTokenById = async (id) => {
  const response = await Token.find({ companyId: id });
  return response;
};

const updateToken = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const userObj = {
    token: update.token,
  };
  let user;
  await User.findById(id).then(async (res) => {
    if (!res) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    user = res;
    let newToken;
    let token;
    await getTokenById(update.companyId).then(async (res) => {
      console.log("tokennnn", update, res[0].token);
      token = res[0];
      !res[0].token.includes(update.token)
        ? res[0].token.push(update.token)
        : null;
      console.log("newToken", res[0].token);
      newToken = {
        token: res[0].token,
      };
      console.log("second then", newToken);
    });
    console.log("first then", newToken, token.id);
    updateTokenById(token.id, newToken);
  });
  console.log("userrrrrr", user);

  Object.assign(user, userObj);

  await user.save();
  return user;
};

module.exports = {
  updateToken,

  createGoalNoti,
};
