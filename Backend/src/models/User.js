import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    avatar: {
      type: String
    },
    accessToken: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
