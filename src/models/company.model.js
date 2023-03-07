/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: false,
    },
    brandColor: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    sizeOfCompany: {
      type: Number,
      required: false,
    },
    organizationType: {
      type: String,
      required: false,
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
    phoneNumber: {
      type: Number,
      required: false,
    },
    aboutCompany: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    forgetCode: {
      type: Number,
      required: false,
    },
    firstTime:{
      type: Boolean,
      default:true
    },
    webNoti:{
      type: Boolean,
      default:false
    },
    profilePic: {
      type: String,
      required: false,
    },
    teamId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team",
      },
    ],
    employeeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    surveyId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "survey",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
companySchema.plugin(toJSON);
companySchema.plugin(paginate);
const Company = mongoose.model("company", companySchema);
module.exports = Company;
