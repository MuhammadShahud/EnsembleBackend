/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");


const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    teamId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
      },
    ],
    employeeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    surveyId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'survey',
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
