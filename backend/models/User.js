import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
    },

    // 🧠 Quiz scores history
    scores: {
      type: [scoreSchema],
      default: [],
    },

    // 🎤 Interview performance history
    interviews: {
      type: [
        {
          role: String,
          score: Number,
          summary: String,
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
