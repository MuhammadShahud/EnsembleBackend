/* eslint-disable prettier/prettier */
const { Company } = require("../models");
const ApiError = require("../utils/APIError");
const httpStatus = require("http-status");
var mongoose = require("mongoose");
const goalsService  = require("../services/goals.service")
const bcrypt = require("bcrypt");
const fs = require("fs");
const s3 = require('../config/aws-config');




const createCompany = async (body) => {
  const company = await Company.create(body);
  return company;
};

const getCompanyById = async (id) => {
  console.log(mongoose.Types.ObjectId.isValid(id));
  const company = await Company.findById(id).populate("employeeId").populate('teamId');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  return company;
};



const updateCompanyById = async (userId, updateBody) => {
  console.log(mongoose.Types.ObjectId.isValid(userId));

  const company = await getCompanyById(userId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  Object.assign(company, updateBody);
  await company.save();
  return company;
};

const postPic = async (userId, file) => {
  try {
    const user = await getCompanyById(userId);
    console.log("file",file);

    const fileStream = fs.createReadStream(file.path);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename,
      ContentDisposition: `inline; filename="${file.originalname}"`
    };

    const data = await new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    console.log("AWsData", data);
    const newUser = {
      profilePic: data.Key,
    };
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    Object.assign(user, newUser);
    await user.save();
    return { user: user, message: 'File uploaded successfully to S3' };
  } catch (err) {
    console.log(err);
    return { error: 'Error uploading file to S3' };
  }
};

const changePassword = async (req, res) => {
  console.log('newPassword',req.body);
  const { newPassword, confirmPassword, oldPassword } = req.body;

  const isUser = await getCompanyById(req.params.id);
  try {
    if (newPassword === confirmPassword) {
      console.log("cond");

      bcrypt
        .compare(oldPassword, isUser.password)
        .then(async (isMatch) => {
          console.log("isMatch");
          if (isMatch) {
            console.log("isMatch2");
            bcrypt.compare(newPassword, isUser.password).then(async (match) => {
              if (match) {
                return res.status(400).json({
                  errors: [{ message: "You should try something deiffent" }],
                });
              } else {
                bcrypt.genSalt(10, function (err, salt) {
                  bcrypt.hash(newPassword, salt, async function (err, hash) {
                    console.log("hash", isUser.password, hash);
                    if (err) throw err;
                    isUser.password = hash;
                    console.log("isUser.password", isUser.password);
                    const result = await updateCompanyById(isUser._id, isUser);
                    return res.status(200).json({
                      message: "password Changed Successfully",
                      user: result,
                    });
                  });
                });
              }
            });
          } else {
            console.log("isMatch3");

            return res.status(400).json({
              errors: [{ message: "Wrong Old Password" }],
            });
          }
        })

        .catch((err) => {
          res.status(500).json({ erros: err });
          console.log("err3");
        });
    } else {
      return res
        .status(400)
        .json({ message: "password and confirm password does not match" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getStatistics = async (id) => {
  const company = await Company.findById(id);
  const goals = await goalsService.getGoalsByCompany(id);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, "company not found");
  }
  let obj = {
    totalTeams : company.teamId.length,
    totalEmployees : company.employeeId.length,
    totalGoalsCompleted: 0
  }

 obj.totalGoalsCompleted = goals.filter(e=>e.isCompleted ===true).length;

  return obj;
};


module.exports = {
  createCompany,
  getCompanyById,
  updateCompanyById,
  postPic,
  getStatistics,
  changePassword
};
