const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let feedbackSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedbackText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    collection: "feedbacks",
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
