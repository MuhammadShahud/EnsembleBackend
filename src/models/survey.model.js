/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const surveySchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    response: [Number],

    companyId: {
      type: String,
      required: true,
    },
    metrics: {
      type: String,
      required: true,
    },
    score5: {
      type: Number,
      default: 0,
    },
    score4: {
      type: Number,
      default: 0,
    },
    score3: {
      type: Number,
      default: 0,
    },
    score2: {
      type: Number,
      default: 0,
    },
    score1: {
      type: Number,
      default: 0,
    },
  
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
surveySchema.plugin(toJSON);
surveySchema.plugin(paginate);
const Survey = mongoose.model("survey", surveySchema);
module.exports = Survey;
