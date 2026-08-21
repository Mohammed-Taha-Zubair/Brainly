import type { NextFunction, Request, Response } from "express";
import { JWT_PAssword } from "./config.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const userMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers["authorization"];

  if (!header) {
    res.status(403).json({
      message: "You are not logged in",
    });
    return;
  }

  try {
    const decoded = jwt.verify(header as string, JWT_PAssword);
    if (decoded && typeof decoded === "object" && "id" in decoded) {
      req.userId = (decoded as JwtPayload).id as string;
      next();
    } else {
      res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    res.status(403).json({
      message: "You are not logged in",
    });
  }
};

