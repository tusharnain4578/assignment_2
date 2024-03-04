import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: true,
  },
  sourceStation: {
    type: String,
    required: true,
  },
  destinationStation: {
    type: String,
    required: true,
  },
  seatCount: {
    type: Number,
    required: true,
  },
  totalFare: {
    type: Number,
    required: true,
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
  coachNumber: { type: Number, required: true },
});

export const Booking = mongoose.model("Booking", bookingSchema);
