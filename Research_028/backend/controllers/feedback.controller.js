const Feedback = require("../models/feedback.model");
const User = require("../models/user.model");

// Add new feedback
exports.addFeedback = async (req, res) => {
  const { feedbackText, rating, userId } = req.body;
  try {
    const feedback = new Feedback({
      userId,
      feedbackText,
      rating,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all feedbacks for a user
exports.getUserFeedbacks = async (req, res) => {
  const userId = req.user._id;

  try {
    const feedbacks = await Feedback.find({ userId }).populate(
      "userId",
      "fullName email"
    ).sort({ createdAt: -1 });
    if (!feedbacks) {
      return res
        .status(404)
        .json({ message: "No feedbacks found for this user." });
    }
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all feedbacks (admin can view all feedback)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate(
      "userId",
      "fullName email"
    ).sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
