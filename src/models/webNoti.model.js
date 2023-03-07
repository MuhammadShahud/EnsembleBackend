/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");


const notificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
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
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);
const notifications = mongoose.model("webNoti", notificationSchema);
module.exports = notifications;
