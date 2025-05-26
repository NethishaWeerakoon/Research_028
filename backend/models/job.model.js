const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    experienceYears: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
    },
    logo: {
      type: String,
    },
    acceptedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rejectedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    appliedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    selectedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hrQuestions: {
      type: String,
      required: [false, "HR Questions are optional"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "jobs",
  }
);

module.exports = mongoose.model("Job", jobSchema);
