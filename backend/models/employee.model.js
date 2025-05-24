const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let employeeDetailsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeName: {
      type: String,
    },
    position: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    companyEmail: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyPhone: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    hrContactName: {
      type: String,
    },
    hrContactEmail: {
      type: String,
    },
    employmentStartDate: {
      type: Date,
      required: true,
    },
    employmentEndDate: { 
      type: Date,
      required: true,
    },
    employeePersonalityLevel: {
      type: Map,
      of: String,
      default: {},
    },
    workProject: {
      type: String,
    },
    projectDescription: {
      type: String,
    },
    howWorkedOnProject: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "employeeDetails",
  }
);

module.exports = mongoose.model("EmployeeDetails", employeeDetailsSchema);
