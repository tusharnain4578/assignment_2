import express from "express";
import { isUserAuthenticated } from "../middlewares/auth";
import {
  bookTicket,
  updatePassword,
  resetPassword,
  showAvailableSeats,
  checkTrains,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/createShiftRequest", isUserAuthenticated, bookTicket);
router.post("/updatePassword", updatePassword);
router.post("/reset-password/:token", resetPassword);
router.get("/showAvailableSeats", isUserAuthenticated, showAvailableSeats);
router.get("/checkTrains", isUserAuthenticated, checkTrains);
router.post("/bookTicket/:id", isUserAuthenticated, bookTicket);
export default router;
