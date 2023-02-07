/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const tokenSchema = mongoose.Schema(
  {
    token: [String],
    companyId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);
tokenSchema.plugin(paginate);
const Tokens = mongoose.model("token", tokenSchema);
module.exports = Tokens;
