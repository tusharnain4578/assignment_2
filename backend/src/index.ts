import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./connectToDatabase";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import AdminRoutes from "./routes/admin.routes";
dotenv.config();
import cron from "node-cron";
import { freeSeats } from "./controllers/seat.controller";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const PORT = process.env.PORT || 5000;
const app = express();
console.log(process.env.PORT);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Connect to the database
connectToDatabase(process.env.MONGO_URL as string);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Packers and Movers!");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// Schedule cron job to free seats
cron.schedule("* * * * *", () => {
  freeSeats();
});

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", AdminRoutes);
