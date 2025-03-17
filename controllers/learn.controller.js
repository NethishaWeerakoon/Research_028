const mongoose = require("mongoose");
const axios = require("axios");
const Learn = require("../models/learn.model");
const backendUrl = process.env.FLASH_BACKEND;

// Save Learning Type and Points
const saveLearningType = async (req, res) => {
  const { userId, learningType, learningTypePoints } = req.body;
  if (!userId || !learningType || learningTypePoints === undefined) {
    return res.status(400).json({
      error: "UserId, learningType, and learningTypePoints are required.",
    });
  }
  try {
    let learn = await Learn.findOne({ userId });
    if (!learn) {
      learn = new Learn({
        userId,
        learningType,
        learningTypePoints,
      });
    } else {
      learn.learningType = learningType;
      learn.learningTypePoints = learningTypePoints;
    }
    const savedLearn = await learn.save();
    res.status(200).json({
      message: "Learning type and points saved successfully.",
      data: savedLearn,
    });
  } catch (error) {
    console.error("Error saving learning type:", error.message);
    res.status(500).json({
      error: "Failed to save learning type.",
      details: error.message,
    });
  }
};

// Update Learning Type and Points
const updateLearningType = async (req, res) => {
  const { userId, learningType, learningTypePoints } = req.body;
  if (!userId || !learningType || learningTypePoints === undefined) {
    return res.status(400).json({
      error: "UserId, learningType, and learningTypePoints are required.",
    });
  }
  try {
    const learn = await Learn.findOne({ userId });
    if (!learn) {
      return res.status(404).json({
        message: "No learning type data found for the given userId.",
      });
    }
    learn.learningType = learningType;
    learn.learningTypePoints = learningTypePoints;
    const updatedLearn = await learn.save();
    res.status(200).json({
      message: "Learning type and points updated successfully.",
      data: updatedLearn,
    });
  } catch (error) {
    console.error("Error updating learning type:", error.message);
    res.status(500).json({
      error: "Failed to update learning type.",
      details: error.message,
    });
  }
};

// Submit Quiz Answer
const submitQuiz = async (req, res) => {
  try {
    const {
      userId,
      score,
      timeTaken,
      correctAnswers,
      totalQuestions,
      learningType,
    } = req.body;
    if (
      !userId ||
      score === undefined ||
      timeTaken === undefined ||
      correctAnswers === undefined ||
      totalQuestions === undefined ||
      learningType === undefined
    ) {
      return res.status(400).json({
        error:
          "All fields are required: userId, score, timeTaken, correctAnswers, totalQuestions, learningType",
      });
    }
    const learn = await Learn.findOne({ userId });
    if (!learn) {
      return res.status(404).json({
        error: "Learn record not found for the given userId",
      });
    }
    learn.score = score;
    learn.timeTaken = timeTaken;
    learn.correctAnswers = correctAnswers;
    learn.totalQuestions = totalQuestions;
    learn.learningType = learningType;
    await learn.save();
    res.status(200).json({
      message: "Learn record updated successfully with quiz results",
      data: {
        score: learn.score,
        correctAnswers: learn.correctAnswers,
        totalQuestions: learn.totalQuestions,
        timeTaken: learn.timeTaken,
        learningType: learn.learningType,
      },
    });
  } catch (error) {
    console.error("Error updating Learn record:", error);
    res.status(500).json({
      error: "An unexpected error occurred while updating the quiz results",
    });
  }
};

// Get Quiz Results for All Users (Aggregated)
const getQuizResults = async (req, res) => {
  try {
    const results = await Learn.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          fullName: "$userDetails.fullName",
          learningType: 1,
          learningTypePoints: 1,
          score: 1,
          timeTaken: 1,
          correctAnswers: 1,
          totalQuestions: 1,
        },
      },
      {
        $sort: { score: -1 },
      },
    ]);
    if (!results.length) {
      return res.status(404).json({ error: "No quiz results found" });
    }
    res.status(200).json({
      message: "Quiz results retrieved successfully",
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: "An unexpected error occurred while retrieving quiz results",
    });
  }
};

// Get Quiz Results for a Specific User
const getQuizResultsForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    const results = await Learn.findOne(
      { userId: objectId },
      {
        _id: 0,
        learningType: 1,
        learningTypePoints: 1,
        score: 1,
        timeTaken: 1,
        correctAnswers: 1,
        totalQuestions: 1,
        filename: 1,
      }
    );
    if (!results) {
      return res
        .status(404)
        .json({ error: "No quiz results found for this user" });
    }
    res.status(200).json({
      message: "User's quiz results retrieved successfully",
      results,
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error.message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Fetch and Save Questions for a Resume
const fetchQuestions = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("Validation failed: userId is missing");
    return res.status(400).json({ error: "UserId is required" });
  }
  try {
    const learn = await Learn.findOne({ userId });
    if (!learn) {
      console.log("Learn document not found for the provided userId");
      return res
        .status(404)
        .json({ error: "No learning document found for this user" });
    }
    // Increase attempt count by 1
    learn.attemptCount = learn.attemptCount + 1;
    // Check if maximum attempt is reached after incrementing
    if (learn.attemptCount >= 20) {
      console.log("Maximum attempt reached for this user");
      return res.status(400).json({ error: "You reached maximum attempt" });
    }
    const { filename, learningType } = learn;
    if (!filename) {
      console.log("No filename found in the Learn document");
      return res
        .status(400)
        .json({ error: "No filename associated with this user" });
    }
    if (!learningType) {
      console.log("No learningType found in the Learn document");
      return res
        .status(400)
        .json({ error: "No learningType associated with this user" });
    }
    console.log(
      `Fetching questions for filename: ${filename} and difficulty_level: ${learningType}`
    );
    const questionsResponse = await axios.post(
      `${backendUrl}/recruitment-project/questions/get-questions`,
      { topic: filename, difficulty_level: learningType }
    );
    const questions = questionsResponse.data;
    if (!questions || questions.length === 0) {
      console.log("No questions returned from the API");
      return res.status(404).json({
        error: "No questions found for the given filename and difficulty_level",
      });
    }
    learn.questions = questions;
    await learn.save();
    console.log("Questions saved successfully");
    res.status(200).json({
      message: "Questions updated successfully",
      filename,
      difficulty_level: learningType,
      questions,
    });
  } catch (error) {
    console.error("Error updating questions:", error.message);
    res.status(500).json({ error: "Failed to update questions" });
  }
};

// Update Filename
const updateFilename = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filename } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    if (!filename || typeof filename !== "string") {
      return res
        .status(400)
        .json({ error: "Filename is required and must be a string" });
    }
    const learn = await Learn.findOne({ userId });
    if (!learn) {
      return res
        .status(404)
        .json({ error: "Learning document not found for this user" });
    }
    learn.filename = filename;
    await learn.save();
    res.status(200).json({
      message: "Filename updated successfully",
      learn,
    });
  } catch (error) {
    console.error("Error updating filename:", error.message);
    res.status(500).json({ error: "Failed to update filename" });
  }
};

module.exports = {
  saveLearningType,
  updateLearningType,
  submitQuiz,
  getQuizResults,
  getQuizResultsForUser,
  fetchQuestions,
  updateFilename,
};
