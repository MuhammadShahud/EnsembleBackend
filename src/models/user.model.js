const mongoose = require("mongoose");
const { roles } = require("../config/roles");
const { toJSON, paginate } = require("./plugins");

const Questions = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    pronouns: {
      type: String,
      required: false,
    },
    descKid: {
      type: String,
      required: false,
    },
    achievment: {
      type: String,
      required: false,
    },
    rockstarSkills: {
      type: Array,
      required: false,
    },
    Hobbies: {
      type: Array,
      required: false,
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
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    publicBio: {
      type: String,
      required: false,
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
    goalsCompleted: {
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
    companyId: {
      type: String,
      required: true,
    },
    teamId: {
      type: String,
      required: false,
      default:""
    },
    token: {
      type: String,
      required: false,
    },
    firstTime: {
      type: Boolean,
      default: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    completedSurveys: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "survey",
      },
    ],
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
