import mongoose from "mongoose";
const TrackCoursesSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    chapterId: { type: mongoose.Schema.Types.ObjectId, required: false },
    subchapterId: { type: mongoose.Schema.Types.ObjectId, required: false },
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: false },

    completedChapters: [{ type: mongoose.Schema.Types.ObjectId }],
    completedSubChapters: [{ type: mongoose.Schema.Types.ObjectId }],
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);
TrackCoursesSchema.index({ user: 1, courseId: 1 }, { unique: true });
export default mongoose.models.trackcourses ||
  mongoose.model("trackcourses", TrackCoursesSchema);
