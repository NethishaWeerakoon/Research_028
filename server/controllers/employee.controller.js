const User = require("../models/user.model");
const EmployeeDetails = require("../models/employee.model");
const nodemailer = require("nodemailer");
const axios = require("axios");

// Add employee details
const addEmployeeDetails = async (req, res) => {
  try {
    console.log("Received request to add employee details.");
    const { userId,
      employeeName,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      hrContactName,
      hrContactEmail,
      registrationNumber,
      position,
      employmentStartDate,
      employmentEndDate } =
      req.body;

    console.log("Request body:", req.body);

    // Validation check
    if (
      !userId ||
      !employeeName ||
      !companyName ||
      !companyEmail ||
      !registrationNumber ||
      !position ||
      !employmentStartDate ||
      !employmentEndDate 
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
      employeeName,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      hrContactName,
      hrContactEmail,
      registrationNumber,
      position,
      employmentStartDate,
      employmentEndDate
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
      subject: "Action Required: Employee Details Form Submission",
      html: `
          <p>Dear ${companyName} Team,</p>
          <p>We hope this email finds you well.</p>
          <p>As part of our onboarding process, we kindly request you to complete the employee details form for <strong>${user.fullName}</strong> (Position: ${position}).</p>
          <p>Please use the link below to fill out the required details:</p>
          <p><a href="http://localhost:5173/company-response/${userId}" style="color: blue; font-weight: bold;">Complete Employee Details Form</a></p>
          <p>We appreciate your time and cooperation. Should you have any questions or require further assistance, please do not hesitate to reach out.</p>
          <p>Best regards,<br>Your Team</p>
      `,
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
