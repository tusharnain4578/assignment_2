import { Booking } from "../models/bookingSchema.models";
import { Coach } from "../models/coach.models";
import { User } from "../models/user.models";

export const freeSeats = async () => {
  try {
    const bookings = await Booking.find({ isCancelled: true });
    bookings.forEach(async (booking) => {
      const coach = await User.Trains.Coach.coachNumber.findById(
        booking.coachNumber
      );
      const train = await User.Train.findById(coach.trainId);
      train.coach.coachNumber.seatsAvailable += booking.seatCount;
      await train.save();
    });
  } catch (err) {
    console.log("Error in freeing seats: ", err);
  }
};
