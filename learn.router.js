const express = require("express");
const router = express.Router();
const learnController = require("../controllers/learn.controller");
const authenticateUser = require("../middleware/authMiddleware");

// Save Learning Type and Points
router.post("/learning-type", authenticateUser, learnController.saveLearningType);

// Update Learning Type and Points
router.put("/update-learning-type", authenticateUser, learnController.updateLearningType);

// Submit quiz answer
router.put("/submit-quiz", authenticateUser, learnController.submitQuiz);

// Get quiz results (aggregated)
router.get("/get-quiz-results", authenticateUser, learnController.getQuizResults);

// Get quiz results for a specific user
router.get("/get-quiz-results/:id", learnController.getQuizResultsForUser);

// Fetch and Save Questions for a Resume
router.put("/get-questions", authenticateUser, learnController.fetchQuestions);

// Update Filename
router.put("/update-filename/:userId", learnController.updateFilename);

module.exports = router;
