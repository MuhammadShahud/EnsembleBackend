const httpStatus = require("http-status");
const { teamService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const createTeam = catchAsync(async (req, res) => {
  const team = await teamService.createTeam(req.body);
  res.status(httpStatus.CREATED).send(team);
});

const getTeamById = catchAsync(async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);
  res.status(httpStatus.CREATED).send(team);
});

const updateTeamById = catchAsync(async (req, res) => {
  const result = await teamService.updateTeamById(req.params.id, req.body);
  res.status(httpStatus.CREATED).send(result);
});

const deleteTeam = catchAsync(async (req, res) => {
  const result = await teamService.deleteTeam(req.params.id);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  createTeam,
  getTeamById,
  updateTeamById,
  deleteTeam
};
