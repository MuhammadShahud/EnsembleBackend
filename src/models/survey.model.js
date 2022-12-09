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
