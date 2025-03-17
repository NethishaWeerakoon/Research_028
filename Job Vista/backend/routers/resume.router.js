const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");
const authenticateUser = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Create resume profile using resume file
router.post("/create-resume-pdf",authenticateUser,upload.single("file"), resumeController.createResumeUsingPDF);

// Create resume profile using resume text
router.post("/create-resume-text",authenticateUser, resumeController.createResumeUsingPDF);

// Search for resumes
router.post("/search-resumes", resumeController.searchResumes);

// Upload video and link it to a resume
router.put("/upload-video/:userId/:jobId",upload.single("video"),resumeController.uploadVideo);

// Update personality text
router.put("/update-personality-text", resumeController.updatePersonalityText);

// Search for recommended resumes
router.post("/search-recommended-resume",resumeController.searchRecommendedResume);

// Retrieve OCR content by userId
router.get("/ocr-content/:id", resumeController.getOcrContent);

// Retrieve Resume Details by userId
router.get("/:id", resumeController.getResumeDetails);

// Retrieve applicants for a job
router.get("/:jobId/applicants", resumeController.getJobApplicants);

module.exports = router;