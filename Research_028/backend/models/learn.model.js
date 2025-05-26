const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Quiz = require("./quiz.model"); // Import Quiz schema

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
      default: 0,
    },
    quizAttempts: [Quiz.schema], 
    attemptCount: {
      type: Number,
      default: 0,
    }
  },
  {
    collection: "learns", 
  }
);

module.exports = mongoose.model("Learn", learnSchema);
