const mongoose = require("mongoose");
const axios = require("axios");
const Learn = require("../models/learn.model");
const Quiz = require("../models/quiz.model");

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

    // Find the Learn document for the given userId
    const learn = await Learn.findOne({ userId });

    if (!learn) {
      return res.status(404).json({
        error: "Learn record not found for the given userId",
      });
    }

    // Access the most recent quiz attempt in the quizAttempts array
    const recentQuiz = learn.quizAttempts[learn.quizAttempts.length - 1];

    // Check if there's no quiz attempt yet
    if (!recentQuiz) {
      return res.status(400).json({
        error: "No quiz attempt found for the given user",
      });
    }

    // Update the most recent quiz attempt with the new score and other details
    recentQuiz.score = score;
    recentQuiz.timeTaken = timeTaken;
    recentQuiz.correctAnswers = correctAnswers;
    recentQuiz.totalQuestions = totalQuestions;
    recentQuiz.learningType = learningType;

    // Save the updated Learn document with the updated quiz attempt
    await learn.save();

    res.status(200).json({
      message:
        "Quiz results updated successfully in the most recent quiz attempt",
      data: {
        score: recentQuiz.score,
        correctAnswers: recentQuiz.correctAnswers,
        totalQuestions: recentQuiz.totalQuestions,
        timeTaken: recentQuiz.timeTaken,
        learningType: recentQuiz.learningType,
      },
    });
  } catch (error) {
    console.error("Error updating quiz attempt:", error);
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
        $unwind: "$quizAttempts", // Unwind the quizAttempts array to work with each quiz separately
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the user details so we can access them directly
      },
      {
        $sort: { "quizAttempts._id": -1 }, // Sort quiz attempts by _id in descending order to get the most recent one
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          fullName: { $first: "$userDetails.fullName" }, // Get the full name of the user
          learningType: { $first: "$learningType" }, // Get the learningType
          learningTypePoints: { $first: "$learningTypePoints" }, // Get learningTypePoints
          score: { $first: "$quizAttempts.score" }, // Get score from the most recent quiz attempt
          timeTaken: { $first: "$quizAttempts.timeTaken" }, // Get timeTaken from the most recent quiz attempt
          correctAnswers: { $first: "$quizAttempts.correctAnswers" }, // Get correctAnswers from the most recent quiz attempt
          totalQuestions: { $first: "$quizAttempts.totalQuestions" }, // Get totalQuestions from the most recent quiz attempt
        },
      },
      {
        $sort: { score: -1 }, // Sort the results by score in descending order
      },
      {
        $project: {
          _id: 0,
          fullName: 1,
          learningType: 1,
          learningTypePoints: 1,
          score: 1,
          timeTaken: 1,
          correctAnswers: 1,
          totalQuestions: 1,
        },
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
    const userId = req.params.id; // Get the userId from request parameters
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Aggregation pipeline to retrieve quiz attempts for a given user
    const results = await Learn.aggregate([
      {
        $match: { userId: objectId },
      },
      {
        $unwind: "$quizAttempts",
      },
      {
        $project: {
          learningType: 1,
          learningTypePoints: 1,
          score: "$quizAttempts.score",
          timeTaken: "$quizAttempts.timeTaken",
          correctAnswers: "$quizAttempts.correctAnswers",
          totalQuestions: "$quizAttempts.totalQuestions",
          filename: "$quizAttempts.filename",
          attemptCount: "$quizAttempts.attemptCount",
        },
      },
      {
        $group: {
          _id: null,
          learningType: { $first: "$learningType" },
          learningTypePoints: { $first: "$learningTypePoints" },
          quizAttempts: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          learningType: 1,
          learningTypePoints: 1,
          quizAttempts: 1,
        },
      },
    ]);

    if (!results.length) {
      return res
        .status(404)
        .json({ error: "No quiz results found for this user" });
    }

    res.status(200).json({
      message: "User's quiz details retrieved successfully",
      results: results[0], // Return the first (and only) result after aggregation
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error.message);
    res.status(500).json({ error: "An unexpected error occurred" });
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

    // Find the learn document by userId
    const learn = await Learn.findOne({ userId });

    if (!learn) {
      return res
        .status(404)
        .json({ error: "Learning document not found for this user" });
    }

    // Check the number of attempts for the given filename
    const existingAttempts = learn.quizAttempts.filter(
      (quiz) => quiz.filename === filename
    ).length;

    // If the filename is already added 3 times, prevent further attempts
    if (existingAttempts >= 3) {
      return res.status(400).json({
        error:
          "You have reached the maximum number of attempts for this topic. Please choose a different topic.",
      });
    }

    // Create a new quiz attempt object with the updated filename
    const newQuiz = new Quiz({
      filename, // Save the filename in the quiz document
    });

    // Add the new quiz attempt to the quizAttempts array in Learn
    learn.quizAttempts.push(newQuiz);
    learn.filename = filename; // Update the filename in Learn document (if needed)

    // Save the updated Learn document
    await learn.save();

    res.status(200).json({
      message: "Filename updated and new quiz object added successfully",
      learn,
    });
  } catch (error) {
    console.error(
      "Error updating filename and adding quiz attempt:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Failed to update filename and add quiz attempt" });
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

    // Access the most recent quiz attempt from the quizAttempts array
    const recentQuiz = learn.quizAttempts[learn.quizAttempts.length - 1];

    // Ensure the filename exists in the most recent quiz attempt
    const filename = recentQuiz.filename;

    if (!filename) {
      console.log("No filename found in the most recent quiz attempt");
      return res
        .status(400)
        .json({ error: "No filename associated with this user" });
    }

    const learningType = learn.learningType;

    if (!learningType) {
      console.log("No learningType found in the Learn document");
      return res
        .status(400)
        .json({ error: "No learningType associated with this user" });
    }

    console.log(
      `Fetching questions for filename: ${filename} and learningType: ${learningType}`
    );

    // Fetch questions from the external API
    const questionsResponse = await axios.post(
      `${process.env.FLASH_BACKEND}/recruitment-project/questions/get-questions`,
      { topic: filename, difficulty_level: learningType }
    );

    const questions = questionsResponse.data;

    if (!questions || questions.length === 0) {
      console.log("No questions returned from the API");
      return res.status(404).json({
        error: "No questions found for the given filename and learningType",
      });
    }

    // Save the questions in the most recent quiz attempt
    recentQuiz.questions = questions;

    // Save the updated learn document
    await learn.save();

    console.log("Questions saved successfully");

    res.status(200).json({
      message: "Questions updated successfully",
      filename,
      learningType,
      questions,
    });
  } catch (error) {
    console.error("Error updating questions:", error.message);
    res.status(500).json({ error: "Failed to update questions" });
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
