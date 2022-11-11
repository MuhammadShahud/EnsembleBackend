/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const teamSchema = mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
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
