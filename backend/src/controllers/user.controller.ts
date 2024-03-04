import express from "express";
import { User } from "../models/user.models";
import { Booking } from "../models/bookingSchema.models";
import { sendMail } from "../utils/mailing";
import bcryptjs from "bcryptjs";

export const bookTicket = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({
        message: "Login to continue...",
      });
    }
    const { sourceStation, destinationStation, seatCount, coachNumber } =
      req.body;
    const { trainId } = req.params;
    const Ticket = new Booking({
      trainId,
      sourceStation,
      destinationStation,
      seatCount,
      totalFare: user.fare * seatCount + (5 / 100 + user.fare * seatCount),
      bookingTime: new Date(),
      coachNumber,
    });
    await Ticket.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { Tickets: Ticket._id },
    });

    const coach = await User.Trains.findById({ _id: trainId }).coaches[
      coachNumber - 1
    ];
    coach.availableSeats -= seatCount;
    await coach.save();
    return res.status(201).json({
      rent: Ticket.totalFare,
      message: " successfully Booked Your Ticket...",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error...",
    });
  }
};

export const showAvailableSeats = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { trainId } = req.body;
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({
        message: "Login to check available seats...",
      });
    }
    const train = await User.Trains.findById({ _id: trainId });
    var totalSeats = 0;
    train.coaches.forEach((coach: any) => {
      if (coach.availableSeats > 0) {
        totalSeats += coach.availableSeats;
      }
    });
    return res.status(200).json({
      availableSeats: totalSeats,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error...",
    });
  }
};

export const checkTrains = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { sourceStation, destinationStation } = req.body;
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res.status(404).json({
        message: "Please login to check trains...",
      });
    }
    const trains = await User.Trains.find({
      startStation: sourceStation,
      Destinations: destinationStation,
    });
    return res.status(200).json({
      trains,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error...",
    });
  }
};

export const updatePassword = async (
  req: express.Request,
  res: express.Response
) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist...",
      });
    }
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getMinutes() + 15); // Expire in 15 minutes
    await User.findByIdAndUpdate(user._id, {
      $set: {
        resetToken,
        resetTokenExpiry,
      },
    });
    sendMail(
      email,
      "Password Reset",
      `Click on the link to reset your password: http://localhost:3000/api/user/resetPassword/${resetToken} valid for 15 minutes only`
    );
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email..." });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error...",
    });
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token...",
      });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    await User.findByIdAndUpdate(user._id, {
      $set: {
        password: hashedPassword,
        resetToken: "",
        resetTokenExpiry: "",
      },
    });
    return res.status(200).json({
      message: "Password reset successfully...",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error...",
    });
  }
};
