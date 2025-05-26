const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

// Route to add feedback
router.post("/add", feedbackController.addFeedback);

// Route to get feedbacks for the current logged-in user
router.get("/my-feedbacks", feedbackController.getUserFeedbacks);

// Route to get all feedbacks
router.get("/all", feedbackController.getAllFeedbacks);

module.exports = router;
