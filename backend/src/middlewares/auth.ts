import express from "express";
import jwt from "jsonwebtoken";

export const isUserAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userAuthToken = req.cookies.userAuthToken || req.headers.userAuthToken;
  const userRefreshToken =
    req.cookies.userRefreshToken || req.headers.userRefreshToken;
  if (!userAuthToken && !userRefreshToken) {
    return res.status(401).json({
      message:
        "Authentication failed: No authToken or refreshToken provided...",
    });
  }
  jwt.verify(
    userAuthToken,
    process.env.JWT_SECRET_KEY || "",
    (err: any, decoded: any) => {
      if (err) {
        jwt.verify(
          userRefreshToken,
          process.env.JWT_REFRESH_SECRET_KEY || "",
          (refreshErr: any, refreshDecoded: any) => {
            if (refreshErr) {
              return res.status(401).json({
                message: "Authentication failed: Both tokens are invalid...",
                ok: false,
              });
            } else {
              const newUserAuthToken = jwt.sign(
                { userId: refreshDecoded.userId },
                process.env.JWT_SECRET_KEY || "",
                { expiresIn: "40m" }
              );
              const newUserRefreshToken = jwt.sign(
                { userId: refreshDecoded.userId },
                process.env.JWT_REFRESH_SECRET_KEY || "",
                { expiresIn: "1d" }
              );
              res.cookie("userAuthToken", newUserAuthToken, { httpOnly: true });
              res.cookie("userRefreshToken", newUserRefreshToken, {
                httpOnly: true,
              });
              Object.assign(req, { userId: refreshDecoded?.userId });
              Object.assign(req, { ok: true });
              next();
            }
          }
        );
      } else {
        Object.assign(req, { userId: decoded?.userId });
        next();
      }
    }
  );
};
