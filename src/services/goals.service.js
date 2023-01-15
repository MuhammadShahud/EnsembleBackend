/* eslint-disable prettier/prettier */
const { Goal } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");

const createGoal = async (body) => {
  const goal = await Goal.create(body);
  return goal;
};

const getGoals = async (filter, options) => {
  const products = Goal.paginate(filter, options);
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
  let completed = 0
  update.steps.forEach(e => {
    e.isDone === true ? completed = completed +1 : null
  });
  update.progress = Math.floor(completed / update.steps.length * 100);
  if(update.progress === 100){
    update.isCompleted = true;
  }else{
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
  updateGoalStep
};
