/* eslint-disable prettier/prettier */
const { Team } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
const companyService = require("../services/company.service")
var mongoose = require("mongoose");

const createTeam = async (body) => {
  const team = await Team.create(body);
  console.log('team',team);
  const company = await companyService.getCompanyById(team.companyId);
  console.log('newCompany',company.teamId);

  const obj = {
    teamId : company.teamId
  }
  obj.teamId.push(team.id)
  const newCompany = await companyService.updateCompanyById(team.companyId,obj);
  console.log('newCompany',newCompany);
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

const deleteTeam = async (id) => {
  const team = await getTeamById(id);
  if (!team) {
    return "Cannot find team";
  }
  await team.remove();

  const company = await companyService.getCompanyById(team.companyId);
  console.log('newCompany',company.teamId);

 
 const array = company.teamId.filter(e=>e !== team.id)
 const obj = {
  teamId : array
}
  const newCompany = await companyService.updateCompanyById(team.companyId,obj);
  console.log('newCompany',newCompany);
  return "team has been deleted"
};
module.exports = {
  createTeam,
  getTeamById,
  updateTeamById,
  deleteTeam
};
