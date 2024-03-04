import mongoose from "mongoose";
const coachSchema = new mongoose.Schema({
  coachNumber: { type: Number, required: true },
  availableSeats: { type: Number, required: true, default: 72 },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: true,
  },
});

export const Coach = mongoose.model("Coach", coachSchema);
