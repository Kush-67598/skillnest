import mongoose from "mongoose";
const CreatorSchema = new mongoose.Schema({
  creatorName: { type: String },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: { type: String }, // <-- add this
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

export default mongoose.models.Creator ||
  mongoose.model("Creator", CreatorSchema);
