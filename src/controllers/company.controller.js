const httpStatus = require("http-status");
const { companyService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const createCompany = catchAsync(async (req, res) => {
  const company = await companyService.createCompany(req.body);
  res.status(httpStatus.CREATED).send(company);
});

const postPic = catchAsync(async (req, res) => {
  console.log('req.file',req.file);
  const user = await companyService.postPic(req.params.id,req.file);
  res.status(httpStatus.CREATED).send(user);
});

const getCompanyById = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  res.status(httpStatus.CREATED).send(company);
});

const updateCompanyById = catchAsync(async (req, res) => {
  const result = await companyService.updateCompanyById(
    req.params.id,
    req.body
  );
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  createCompany,
  getCompanyById,
  updateCompanyById,
  postPic
};
