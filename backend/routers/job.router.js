const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

// Create a new job post (using multer middleware for logo upload)
router.post("/create",jobController.upload.single("logo"),jobController.createJob);

// Search for jobs
router.post("/search", jobController.searchJobs);

// Get all jobs
router.get("/all", jobController.getAllJobs);

// Get a job by ID
router.get("/:id", jobController.getJobById);

// Update a job
router.put("/:id", jobController.updateJob);

// Delete a job
router.delete("/:job_id", jobController.deleteJob);

// Get jobs created by a specific user
router.get("/user/:userId", jobController.getUserCreatedJobs);

// Update user status for a job
router.put("/update-user-status/:jobId", jobController.updateUserStatus);

module.exports = router;
