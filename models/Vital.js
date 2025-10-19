import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bp: { type: String },       // e.g. "120/80"
  sugar: { type: String },    // e.g. "110 mg/dL"
  weight: { type: Number },
  notes: { type: String },
  date: { type: Date, default: Date.now },
});

const Vital = mongoose.model("Vital", vitalSchema);

export default Vital;
