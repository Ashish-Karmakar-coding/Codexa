import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    line: Number,
    severity: {
      type: String,
      enum: ["low", "medium", "high"]
    },
    message: String
  },
  { _id: false }
);

const codeReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    issues: [issueSchema],
    suggestions: {
      type: [String]
    },
    aiModel: {
      type: String,
      default: "gpt-4.1"
    },
    promptVersion: {
      type: String,
      default: "v1"
    }
  },
  { timestamps: true }
);

export default mongoose.model("CodeReview", codeReviewSchema);
