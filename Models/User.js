import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  POTD: [
    {
      Question: { type: String, default: "" },
      Answer: { type: String, default: "" },
      Difficulty: { type: String, default: "" },
      POTDStreak: { type: Number, default: 0 },
      TotalSolved: { type: Number, default: 0 },
      OverallCodingScore: { type: Number, default: 0 },
      lastSolvedDate: { type: Date, default: null },
      expiresAt: { type: Date, required: true },
    },
  ],
  premiumCourseID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  profileImg: { type: String },
  bio: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  googleId: { type: String },
  pro: { type: Boolean, default: false }, 
  proClaimedAt: { type: Date },
  proExpiresAt: { type: Date },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
mongoose.models = {};
