import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: String,
  order: Number,
  mainTitle: { type: String }, // Main heading of the lesson
  sections: [
    {
      subHeading: { type: String }, // Subheading
      paragraph: { type: String }, // Text content
      codeSnippet: { type: String }, // Optional code
      images: [String], // Optional images inside the section
    },
  ], // Array of 3 sections
  videoURL: String,
});

const SubChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [LessonSchema],
});

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  subChapters: [SubChapterSchema],
});
const CoursesSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator",required: true },
  description: { type: String, required: true },
  thumbnailURL: { type: String },
  chapters: [ChapterSchema],
});

export default mongoose.models.Course ||
  mongoose.model("Course", CoursesSchema);
