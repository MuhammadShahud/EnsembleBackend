/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const teamSchema = mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    teamLead:{
      type:String,
      required:true
    },
    teamColor:{
      type:String,
      required:true
    },
    employeeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
teamSchema.plugin(toJSON);
teamSchema.plugin(paginate);
const Team = mongoose.model("team", teamSchema);
module.exports = Team;
