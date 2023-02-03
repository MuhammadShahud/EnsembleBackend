/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const stepSchema = mongoose.Schema({
  step: {
    type: String,
    required: true,
  },
  num: {
    type: Number,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const goalSchema = mongoose.Schema(
  {
    goal: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    steps: {
      type: [stepSchema],
      required: false,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
goalSchema.plugin(toJSON);
goalSchema.plugin(paginate);
const Goal = mongoose.model("goal", goalSchema);
module.exports = Goal;
