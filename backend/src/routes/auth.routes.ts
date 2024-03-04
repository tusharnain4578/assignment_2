import express from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { isUserAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isUserAuthenticated, logout);

export default router;
