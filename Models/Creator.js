import mongoose from "mongoose";
const CreatorSchema = new mongoose.Schema({
  creatorName: { type: String },
  email: { type: String, required: true, unique: true },
  password:{type:String,required:true},
  courses:[{type:mongoose.Schema.Types.ObjectId,ref:"Course"}]
});

export default mongoose.models.User || mongoose.model("Creator", CreatorSchema);
mongoose.models = {};
