import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  txn_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  status: { type: String, required: true },
  amount: { type: String, required: true },
  phone: { type: Number },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
});
export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
