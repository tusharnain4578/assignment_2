import { NextFunction, Request, Response } from "express";

import { User } from "../models/user.models";

export const checkRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = await User.findById(req.userId);

  if (user.role === "User") {
    return res.status(400).json({
      message:
        "Unauthorized access..., You are not authorized to access this page...",
    });
  }
  return next();
};
