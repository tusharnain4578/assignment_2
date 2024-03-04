import mongoose from "mongoose";

const TrainSchema = new mongoose.Schema({
  typeOfTrain: { type: String, required: true },
  coaches: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  arrivalTime: { type: String, required: true },
  departureTime: { type: String, required: true },
  fare: { type: Number, required: true },
  startStation: { type: String, required: true },
  destinations: [{ type: String, required: true }],
  currentStation: { type: String },
});

export const Train = mongoose.model("Train", TrainSchema);
