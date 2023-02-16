/* eslint-disable prettier/prettier */
const { Team, User } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
const companyService = require("../services/company.service");
var mongoose = require("mongoose");
const userService = require("../services/user.service");

const createTeam = async (body) => {
  const team = await Team.create(body);
  console.log("team", team);
  const company = await companyService.getCompanyById(team.companyId);
  console.log("newCompany", company.teamId);
  const userTeam = {
    teamId: team.id,
  };
  team.employeeId.forEach(async (e) => {
    await userService.updateUserById(e, userTeam);
  });

  const obj = {
    teamId: company.teamId,
  };
  obj.teamId.push(team.id);
  const newCompany = await companyService.updateCompanyById(
    team.companyId,
    obj
  );
  console.log("newCompany", newCompany);
  return team;
};

const getTeamById = async (id) => {
  const team = await Team.findById(id).populate("employeeId");
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  return team;
};

const updateTeamById = async (userId, updateBody) => {
  const team = await getTeamById(userId);
  console.log("A");
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  if (updateBody.employeeId) {
    const userTeam = {
      teamId: team.id,
    };
    const noTeam = {
      teamId: "",
    };
    let oldEmployee = [];

    console.log("employeee", team.employeeId, updateBody.employeeId);
    updateBody.employeeId
      ? team.employeeId.forEach((e, i) => {
          console.log("employeee", !updateBody.employeeId.includes(e.id));

          !updateBody.employeeId.includes(e.id) ? oldEmployee.push(e) : null;
        })
      : null;

    updateBody.employeeId.forEach(async (e) => {
      const userTeamm = await User.findById(e);
      Object.assign(userTeamm, userTeam);
      await userTeamm.save();
    });
    console.log("B");

    if (oldEmployee) {
      console.log("oldddd", oldEmployee);
      oldEmployee.forEach(async (e) => {
        await userService.updateUserById(e, noTeam);
      });
    }
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

  const company = await companyService.getCompanyById(team.companyId);
  console.log("newCompany", company.teamId);

  const userTeam = {
    teamId: "",
  };

  team.employeeId.forEach(async (e) => {
    await userService.updateUserById(e, userTeam);
  });

  const array = company.teamId.filter((e) => e !== team.id);
  const obj = {
    teamId: array,
  };
  const newCompany = await companyService.updateCompanyById(
    team.companyId,
    obj
  );
  console.log("newCompany", newCompany);
  await team.remove();

  return "team has been deleted";
};
module.exports = {
  createTeam,
  getTeamById,
  updateTeamById,
  deleteTeam,
};
