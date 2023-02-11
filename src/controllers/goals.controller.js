/* eslint-disable prettier/prettier */
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { goalsService } = require("../services");
const pick = require("../utils/pick");

const createGoal = catchAsync(async (req, res) => {
  const response = await goalsService.createGoal(req.body);
  console.log("response --> ", response);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Goal has been created", response });
});

const getGoals = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['employeeId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await goalsService.getGoals(
      filters,
      options,
  );
  res.send(result);
});

const getGoalsDashboard = catchAsync(async (req, res) => {
console.log(req.query.employeeId);
  const result = await goalsService.getGoalsDashboard(
    req.query.employeeId
  );
  res.send(result);
});

const getGoalsByCompany = catchAsync(async (req, res) => {
  // const filters = pick(req.query, ['companyId']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // const result = await goalsService.getGoalsByCompany(
  //     filters,
  //     options,
  // );
  const result = await goalsService.getGoalsByCompany(
    req.query.companyId
 );
  res.send(result);
});

const updateGoal = catchAsync(async (req, res) => {
  const result = await goalsService.updateGoal(req.params.id, req.body);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Goal has been updated", result });
});

const updateGoalStep = catchAsync(async (req, res) => {
  const result = await goalsService.updateGoalStep(req.params.id, req.body);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Goal has been updated", result });
});

const deleteGoal = async (req, res) => {
  const response = await goalsService.deleteGoal(req.params.id);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Goal has been deleted", response });
};
module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  updateGoalStep,
  getGoalsByCompany,
  getGoalsDashboard
};
