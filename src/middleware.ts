import type { NextFunction, Request, Response } from "express";
import { JWT_PAssword } from "./config.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const userMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rawHeader = req.headers["authorization"] || req.headers["token"];

  if (!rawHeader) {
    res.status(403).json({
      message: "Authorization header missing. Pass token in 'Authorization' or 'token' header.",
    });
    return;
  }

  const headerStr = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

  if (!headerStr) {
    res.status(403).json({
      message: "Authorization header is empty.",
    });
    return;
  }

  const token = headerStr.startsWith("Bearer ")
    ? headerStr.slice(7).trim()
    : headerStr.trim();

  if (!token) {
    res.status(403).json({
      message: "Token is empty.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_PAssword);
    if (decoded && typeof decoded === "object" && "id" in decoded) {
      req.userId = (decoded as JwtPayload).id as string;
      next();
    } else {
      res.status(403).json({
        message: "Invalid token payload.",
      });
    }
  } catch (e: any) {
    console.error("JWT verification error:", e?.message);
    res.status(403).json({
      message: `Authentication failed: ${e?.message || "Invalid token"}`,
    });
  }
};

