const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
let User = require("../models/user.model");
let Job = require("../models/job.model");
let Resume = require("../models/resume.model");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SECRET_REGION,
});

// Setup Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files will be stored temporarily here

// Create a New User
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, roleType } = req.body;

    if (!email || !fullName || !password || !roleType) {
      return res.status(400).json({ warn: "Important field(s) are empty" });
    }

    const exist = await User.findOne({ email: email });
    if (exist) {
      return res
        .status(400)
        .json({ warn: "An account already exists with this email" });
    }

    if (password.trim() === "") {
      return res.status(400).json({ warn: "Password cannot be empty" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: passwordHash,
      roleType,
    });

    await newUser.save();
    res.status(200).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ msg: "An error occurred during user registration" });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const Login = await User.findOne({ email: email });
    if (email === "" || password === "")
      return res
        .status(200)
        .json({ msg: "Email or password fields are empty" });

    if (!Login) return res.status(200).json({ msg: "Invalid email" });

    const validate = await bcrypt.compare(password, Login.password);
    if (!validate) return res.status(200).json({ msg: "Password is invalid" });

    // JWT secret
    const token = jwt.sign({ id: Login._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      Info: {
        id: Login._id,
        email: Login.email,
        fullName: Login.fullName,
        RoleType: Login.RoleType,
      },
      User: Login,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(400).json({ msg: "Validation Error" });
  }
};

// Update user image
const uploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Read the temporary file
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    const params = {
      Bucket: "rp-projects-public",
      Key: `user-images/${userId}/${Date.now()}-${req.file.originalname}`,
      Body: fileStream,
      ContentType: req.file.mimetype,
    };

    // Upload to S3
    s3.upload(params, async (err, data) => {
      // Delete the temporary file after uploading
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });

      if (err) {
        console.error("Error uploading image to S3:", err);
        return res.status(500).json({ error: "Error uploading image to S3" });
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        user.userImgUrl = data.Location;
        await user.save();

        res.status(200).json({
          message: "Image uploaded successfully",
          userId,
          imageUrl: data.Location,
        });
      } catch (dbErr) {
        console.error("Error saving image URL to database:", dbErr);
        res.status(500).json({ error: "Error saving image URL to database" });
      }
    });
  } catch (err) {
    console.error("Error during image upload:", err.message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Update applied job
const applyJob = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const existingResume = await Resume.findOne({ userId });
    if (!existingResume) {
      return res.status(400).json({
        error: "You need to create a resume before applying for jobs",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if user has already applied for this job
    if (job.appliedUsers.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job" });
    }

    // Add userId to the job's appliedUsers array
    job.appliedUsers.push(userId);

    // Add jobId to the user's jobId array
    if (!user.jobId.includes(jobId)) {
      user.jobId.push(jobId);
    }
    await job.save();
    await user.save();

    res.status(200).json({
      message: "Successfully applied for the job",
      updatedUser: user,
      updatedJob: job,
    });
  } catch (err) {
    console.error("Error applying for the job:", err);
    res
      .status(500)
      .json({ error: "An error occurred while applying for the job" });
  }
};

// Get applied jobs
const getAppliedJobs = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const user = await User.findById(userId).populate({
      path: "jobId",
      model: "Job",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.jobId.length === 0) {
      return res
        .status(200)
        .json({ message: "User has not applied to any jobs" });
    }

    res.status(200).json({
      appliedJobs: user.jobId,
    });
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching applied jobs" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  uploadUserImage,
  applyJob,
  getAppliedJobs,
  upload, // Export multer upload to use in the router if needed
};
