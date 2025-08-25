import mongoose from "mongoose";
const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

export default mongoose.models.Bookmark ||
  mongoose.model("Bookmark", BookmarkSchema);
mongoose.models = {};
