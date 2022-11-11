/* eslint-disable prettier/prettier */
const { Team } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");

const createTeam = async (body) => {
  const team = await Team.create(body);
  return team;
};

const getTeamById = async (id) => {
  const team = await Team.findById(id).populate('employeeId');
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  return team;
};

const updateTeamById = async (userId, updateBody) => {
  const team = await getTeamById(userId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  Object.assign(team, updateBody);
  await team.save();
  return team;
};
module.exports = {
  createTeam,
  getTeamById,
  updateTeamById,
};
