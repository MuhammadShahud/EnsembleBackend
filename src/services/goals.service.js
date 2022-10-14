/* eslint-disable prettier/prettier */
const { Goal } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");

const createGoal = async (body) => {
  const goal = await Goal.create(body);
  return goal;
};

const getGoals = async (req) => {
  const products = Goal.find();
  return products;
};

const getGoalById = async(id) => {
      const response = await Goal.findById(id);
      return response;
      }

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

const deleteGoal = async (id) => {
      const goal = await getGoalById(id);
      if (!goal) {
          return 'Cannot find Goal'
      }
      await goal.remove();
      return goal;
  }


module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
};
