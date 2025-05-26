const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let quizSchema = new Schema(
  {
    score: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    filename: {
      type: String,
      required: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        question: String,
        answer_choices: [String],
        correct_answer: String,
        explanation: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: "quizzes", 
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
