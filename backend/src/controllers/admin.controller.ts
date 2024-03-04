import express from "express";
import { Train } from "../models/train.models";
import { User } from "../models/user.models";
import { Coach } from "../models/coach.models";

export const createTrain = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      typeOfTrain,
      arrivalTime,
      departureTime,
      fare,
      startStation,
      destinations,
      coaches,
      currentStation
      
     
    } = req.body;
    const train = new Train({
      typeOfTrain,
      arrivalTime,
      departureTime,
      coaches,
      fare,
      startStation,
      destinations,
      currentStation
    });
    await train.save();
    const admin = await User.findById(req.userId);
    admin?.Trains.push(train._id);
    return res.status(201).json({
      message: "Vehicle created successfully...",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to create vehicle...",
    });
  }
};

export const createAndAddCoach = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { totalSeats, availableSeats, trainId } = req.body;
    const coach = new Coach({
      totalSeats,
      availableSeats,
      trainId,
    });
    await coach.save();
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({
        message: "Train not found hence Couldnt add coach...",
      });
    }
    train.coaches.push(coach._id);
    await train.save();
    return res.status(200).json({
      message: "Coach added successfully to the given train...",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error...",
    });
  }
};

export const getAllTrains = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const trains = await User.Trains.find();
    return res.status(200).json({
      trains,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error...",
    });
  }
};

export const updateTrainStation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { trainId, currentStation } = req.body;
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({
        message: "Train not found...",
      });
    }
    train.currentStation = currentStation;
    await train.save();
    return res.status(200).json({
      message: "Train station updated successfully...",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error...",
    });
  }
};
