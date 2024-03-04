const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: String, enum: ["Admin", "User"], default: "User" },
  Trains: [{ type: mongoose.Schema.Types.ObjectId, ref: "Train" }],
  Tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

export const User = mongoose.model("User", userSchema);
