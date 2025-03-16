const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let resumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    ocrContent: [
      [
        {
          page_number: {
            type: Number,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
        },
      ],
    ],
    s3VideoLinks: [
      {
        jobId: {
          type: Schema.Types.ObjectId,
          ref: "Job",
        },
        link: {
          type: String,
        },
      },
    ],
    s3CVLink: {
      type: String,
      default: null,
    },
    personalityLevel: {
      type: Map,
      of: String,
      default: {},
    },
    emotionalLevel: [
      {
        jobId: { type: Schema.Types.ObjectId, ref: "Job" },
        emotionLevel: { type: Map, of: Number },
      },
    ],
    personalityText: {
      type: String,
      default: "",
    },

    experienceYears: {
      type: Number,
    },
  },
  {
    collection: "resumes",
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
