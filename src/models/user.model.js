const mongoose = require("mongoose");
const { roles } = require("../config/roles");
const { toJSON, paginate } = require("./plugins");

const Questions = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pronouns: {
      type: String,
      required: true,
    },
    descKid: {
      type: String,
      required: true,
    },
    achievment: {
      type: String,
      required: true,
    },
    rockstarSkills: {
      type: Array,
      required: true,
    },
    Hobbies: {
      type: Array,
      required: true,
    },
  },
  {
    timestaps: true,
  }
);

const profileData = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    publicBio: {
      type: String,
      required: true,
    },
   
  },
  {
    timestaps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    forgetCode: {
      type: Number,
      required: false,
    },
    questions: {
      type: Questions,
      required: false,
    },
    profileData: {
      type: profileData,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    companyId:{
      type: String,
      required: true
    },
    teamId:{
      type: String,
      required: false
    },
    firstTime:{
      type: Boolean,
      default:true
    },
    completedSurveys : [String]
  },
  {
    timestaps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * @typedef User
 */

const User = mongoose.model("user", userSchema);
module.exports = User;
