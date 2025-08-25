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
  profileImg: { type: String },
  bio: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  googleId: { type: String },
  premium: { type: String, unique: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
mongoose.models = {};
