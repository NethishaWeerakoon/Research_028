const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let learnSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    learningType: {
      type: String,
      default: "",
    },
    learningTypePoints: {
      type: Number,
      default: "",
    },
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
    collection: "learns",
  }
);

module.exports = mongoose.model("Learn", learnSchema);
