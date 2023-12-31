/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");



const metricsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    metrics: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
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
metricsSchema.plugin(toJSON);
metricsSchema.plugin(paginate);
const Metric = mongoose.model("metric", metricsSchema);
module.exports = Metric;
