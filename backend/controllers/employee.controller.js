const User = require("../models/user.model");
const EmployeeDetails = require("../models/employee.model");
const nodemailer = require("nodemailer");
const axios = require("axios");

// Add employee details
const addEmployeeDetails = async (req, res) => {
  try {
    console.log("Received request to add employee details.");
    const { userId, companyName, companyEmail, registrationNumber, position } =
      req.body;

    console.log("Request body:", req.body);

    // Validation check
    if (
      !userId ||
      !companyName ||
      !companyEmail ||
      !registrationNumber ||
      !position
    ) {
      console.log("Validation failed: Missing required fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found with ID: ${userId}`);
      return res.status(404).json({ message: "User not found." });
    }
    console.log("User found:", user.email);

    // Check if user already has an employee details form
    const existingEmployeeDetails = await EmployeeDetails.findOne({ userId });
    if (existingEmployeeDetails) {
      console.log("Employee details form already exists for this user.");
      return res
        .status(400)
        .json({ message: "You cannot add multiple forms." });
    }

    // Save employee details
    const employeeDetails = new EmployeeDetails({
      userId,
      companyName,
      companyEmail,
      registrationNumber,
      position,
    });

    const savedDetails = await employeeDetails.save();
    console.log("Employee details saved:", savedDetails);

    // Send email to company email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: companyEmail,
      subject: "Please Fill Out the Employee Details Form",
      text: `Hello,\n\nPlease use the following link to complete the employee details form:\n\nhttp://45.134.226.131:9102/company-response/${userId}\n\nThank you!\nYour Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", process.env.EMAIL_PASSWORD);

    res.status(201).json({
      message:
        "Employee details added successfully, and email sent to the company.",
      data: savedDetails,
    });
  } catch (error) {
    console.error("Error adding employee details:", error);
    res.status(500).json({
      message: "Error processing the request.",
      error: error.message,
    });
  }
};

// Update employee details
const updateEmployeeDetails = async (req, res) => {
  try {
    const {
      userId,
      workProject,
      projectDescription,
      howWorkedOnProject,
    } = req.body;

    // Validation check
    if (!userId) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Find employee details
    const employeeDetails = await EmployeeDetails.findOne({ userId });
    if (!employeeDetails) {
      return res.status(404).json({ message: "Employee details not found." });
    }

    // Update employee details
    if (workProject !== undefined) employeeDetails.workProject = workProject;
    if (projectDescription !== undefined) employeeDetails.projectDescription = projectDescription;
    if (howWorkedOnProject !== undefined) employeeDetails.howWorkedOnProject = howWorkedOnProject;

    const updatedDetails = await employeeDetails.save();

    // Respond to client immediately
    res.status(200).json({
      message: "Employee details updated successfully.",
      data: updatedDetails,
    });

    // Async call to personality prediction API
    try {
      const response = await axios.post(
        `${process.env.FLASH_BACKEND}/recruitment-project/personality/predict-personality`,
        { sentence: howWorkedOnProject}
      );

      console.log(response)

      if (response.data) {
        employeeDetails.employeePersonalityLevel = response.data;
        await employeeDetails.save();
        console.log("Employee personality level updated successfully:", response.data);
      }
    } catch (apiError) {
      console.error("Error calling personality prediction API:", apiError.message);
    }

  } catch (error) {
    res.status(500).json({
      message: "Error updating employee details.",
      error: error.message,
    });
  }
};

// Get employee details by userId
const getEmployeeDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find employee details and populate user fullName
    const employeeDetails = await EmployeeDetails.find({ userId }).populate(
      "userId",
      "fullName"
    );

    if (!employeeDetails || employeeDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No employee details found for this user." });
    }

    res.status(200).json({
      message: "Employee details retrieved successfully.",
      data: employeeDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving employee details.",
      error: error.message,
    });
  }
};

module.exports = {
  addEmployeeDetails,
  updateEmployeeDetails,
  getEmployeeDetails,
};
