const httpStatus = require("http-status");
const { User, Team } = require("../models");
const ApiError = require("../utils/APIError");
const fs = require("fs");
const bcrypt = require("bcrypt");
const companyService = require("../services/company.service");
const s3 = require('../config/aws-config');

// const teamService  = require("../services/team.service");

const createUser = async (userBody) => {
  console.log((await User.find({ orderId: userBody.orderId })).length);
  if ((await User.find({ orderId: userBody.orderId })).length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already taken");
  } else {
    const user = await User.create(userBody);
    return user;
  }
};

const postPic = async (userId, file) => {
  try {
    const user = await getUserById(userId);

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


const getPic = async (key) => {
  const downloadParams = {

    Key: key,
  
    Bucket: process.env.AWS_BUCKET_NAME,
  
  };
  
  return s3.getObject(downloadParams).createReadStream();
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email, token) => {
  return User.findOneAndUpdate(
    { email },
    {
      token: token,
    },
    { new: true }
  );
};
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.teamId) {
    if (user.teamId) {
      const oldTeam = await Team.findById(user.teamId);
      console.log("oldTeammm",oldTeam,user);
      if(oldTeam){
      console.log("newTeam", oldTeam.employeeId.indexOf(user.id));
      oldTeam.employeeId.splice(oldTeam.employeeId.indexOf(user.id), 1);
      const objOldTeam = {
        employeeId: oldTeam.employeeId,
      };
      console.log("newTeam", objOldTeam, oldTeam.employeeId);

      Object.assign(oldTeam, objOldTeam);
      await oldTeam.save();
    }
    }

    const team = await Team.findById(updateBody.teamId);
    if (!team) {
      throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
    }
    const objTeam = {
      employeeId: team.employeeId,
    };
    !team.employeeId.includes(user.id)
      ? objTeam.employeeId.push(user.id)
      : null;
    Object.assign(team, objTeam);
    await team.save();
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};



const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();

  const company = await companyService.getCompanyById(user.companyId);
  console.log("newCompany", company.employeeId);

  const array = company.employeeId.filter((e) => e !== user.id);
  const obj = {
    employeeId: array,
  };
  const newCompany = await companyService.updateCompanyById(
    user.companyId,
    obj
  );
  if (user.teamId) {
    const oldTeam = await Team.findById(user.teamId);
    console.log("newTeam", oldTeam.employeeId.indexOf(user.id));
    oldTeam.employeeId.splice(oldTeam.employeeId.indexOf(user.id), 1);
    const objOldTeam = {
      employeeId: oldTeam.employeeId,
    };
    console.log("newTeam", objOldTeam, oldTeam.employeeId);

    Object.assign(oldTeam, objOldTeam);
    await oldTeam.save();
  }
  console.log("newCompany", newCompany);
  return "Employee has been deleted";
};

const changePassword = async (req, res) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;

  const isUser = await getUserById(req.params.id);
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
                    const result = await updateUserById(isUser._id, isUser);
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

module.exports = {
  createUser,
  postPic,
  queryUsers,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  changePassword,
  getPic
};
