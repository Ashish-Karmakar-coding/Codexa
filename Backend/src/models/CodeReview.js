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
    summary: {
      type: String
    },
    issues: [issueSchema],
    suggestions: {
      type: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("CodeReview", codeReviewSchema);
