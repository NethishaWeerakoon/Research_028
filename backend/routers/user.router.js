const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Create a New User
router.post("/register", userController.registerUser);

// User login
router.post("/login", userController.loginUser);

// Update user image
router.put("/upload-image/:userId",userController.upload.single("image"), userController.uploadUserImage);

// Update applied job
router.put("/apply-job", userController.applyJob);

// Get applied jobs
router.get("/applied-jobs/:userId", userController.getAppliedJobs);

module.exports = router;
