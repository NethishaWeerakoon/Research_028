const User = require("../models/user.model");
const EmployeeDetails = require("../models/employee.model");
const nodemailer = require("nodemailer");
const axios = require("axios");

const emailpassword = process.env.EMAIL_PASSWORD;
const backendUrl = process.env.FLASH_BACKEND;

// Add employee details
const addEmployeeDetails = async (req, res) => {
  try {
    const { userId, companyName, companyEmail, registrationNumber, position } =
      req.body;

    // Validation check
    if (
      !userId ||
      !companyName ||
      !companyEmail ||
      !registrationNumber ||
      !position
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user already has an employee details form
    const existingEmployeeDetails = await EmployeeDetails.findOne({ userId });
    if (existingEmployeeDetails) {
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

    // Send email to company email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "avishk.work@gmail.com",
        pass: emailpassword,
      },
    });

    const mailOptions = {
      from: "avishk.work@gmail.com",
      to: companyEmail,
      subject: "Please Fill Out the Employee Details Form",
      text: `Hello,\n\nPlease use the following link to complete the employee details form:\n\nhttp://45.134.226.131:9102/company-response/${userId}\n\nThank you!\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message:
        "Employee details added successfully, and email sent to the company.",
      data: savedDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing the request.",
      error: error.message,
    });
  }
};

// Update employee details
const updateEmployeeDetails = async (req, res) => {
  try {
    const { userId, employeeQualities } = req.body;

    // Validation check
    if (!userId || !employeeQualities) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if employee details exist for the user
    const employeeDetails = await EmployeeDetails.findOne({ userId });
    if (!employeeDetails) {
      return res.status(404).json({ message: "Employee details not found." });
    }

    // Update employee details
    employeeDetails.employeeQualities = employeeQualities;
    const updatedDetails = await employeeDetails.save();

    // Respond to the client immediately after update
    res.status(200).json({
      message: "Employee details updated successfully.",
      data: updatedDetails,
    });

    // Call the personality prediction API asynchronously
    try {
      const response = await axios.post(
        `${backendUrl}/recruitment-project/personality/predict-personality`,
        { sentence: employeeQualities }
      );

      // Update the employeePersonalityLevel with the response
      if (response.data) {
        employeeDetails.employeePersonalityLevel = response.data;
        await employeeDetails.save();
        console.log(
          "Employee personality level updated successfully:",
          response.data
        );
      }
    } catch (apiError) {
      console.error(
        "Error calling personality prediction API:",
        apiError.message
      );
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
