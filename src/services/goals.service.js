/* eslint-disable prettier/prettier */
const { Goal } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
const moment = require("moment");
const { createGoalNoti } = require("./extraServices/noti.service");
const { object } = require("joi");

const createGoal = async (body) => {
  // const goal = await Goal.create(body);
  if (body.reminder === true) {
    console.log("notiiii");
    let noti = {
      title: "DueDate is tomorrow",
      text: body.goal,
      navigate: "Goals",
      companyId: body.companyId,
      type: "Goals",
    };
    const response = await createGoalNoti(body.employeeId, noti, body.dueDate);
    console.log("firebaseee", response);
  }
  return goal;
};

const getGoals = async (filter, options) => {
  let products = await Goal.paginate(filter, options);
  let goals = {
    results: [],
  };
  products.results.forEach((e, i) => {
    // let newDate = e.dueDate.toString().split("T")[0].split("-");
    // newDate[1] === "01"
    //   ? (newDate[1] = "Jan")
    //   : newDate[1] === "02"
    //   ? (newDate[1] = "Feb")
    //   : newDate[1] === "03"
    //   ? (newDate[1] = "Mar")
    //   : newDate[1] === "04"
    //   ? (newDate[1] = "Apr")
    //   : newDate[1] === "05"
    //   ? (newDate[1] = "May")
    //   : newDate[1] === "06"
    //   ? (newDate[1] = "Jun")
    //   : newDate[1] === "07"
    //   ? (newDate[1] = "Jul")
    //   : newDate[1] === "08"
    //   ? (newDate[1] = "Aug")
    //   : newDate[1] === "09"
    //   ? (newDate[1] = "Sep")
    //   : newDate[1] === "10"
    //   ? (newDate[1] = "Oct")
    //   : newDate[1] === "11"
    //   ? (newDate[1] = "Nov")
    //   : newDate[1] === "12"
    //   ? (newDate[1] = "Dec")
    //   : null;
    //   console.log("newDate",newDate);
    const date = moment(e.dueDate).format("DD,MMM,YYYY");

    goals.results[i] = {
      _id: e.id,
      goal: e.goal,
      isCompleted: e.isCompleted,
      reminder: e.reminder,
      dueDate: date,
      steps: e.steps,
      employeeId: e.employeeId,
      companyId: e.companyId,
      progress: e.progress,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      __v: e.__v,
    };

    // products.results[i].dueDate = moment(e.dueDate).format("Do,MMM,YYYY")
    console.log("products",e, goals.results[i]);
  });
  // console.log("endddd",products);
  return goals;
};

const getGoalsByCompany = async (body) => {
  const products = Goal.find({ companyId: body }).populate("employeeId");

  return products;
};

const getGoalById = async (id) => {
  const response = await Goal.findById(id);
  return response;
};

const updateGoal = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const goal = await getGoalById(id);
  if (!goal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Goal not found.");
  }
  Object.assign(goal, update);
  await goal.save();
  return goal;
};

const updateGoalStep = async (id, update) => {
  console.log("idddddddddddd", id, "upddateeeeeee", update);
  const goal = await getGoalById(id);
  if (!goal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Goal not found.");
  }
  let completed = 0;
  update.steps.forEach((e) => {
    e.isDone === true ? (completed = completed + 1) : null;
  });
  update.progress = Math.floor((completed / update.steps.length) * 100);
  if (update.progress === 100) {
    update.isCompleted = true;
  } else {
    update.isCompleted = false;
  }
  Object.assign(goal, update);
  await goal.save();
  return goal;
};

const deleteGoal = async (id) => {
  const goal = await getGoalById(id);
  if (!goal) {
    return "Cannot find Goal";
  }
  await goal.remove();
  return goal;
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  updateGoalStep,
  getGoalsByCompany,
};
