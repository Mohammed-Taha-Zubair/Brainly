import type { NextFunction, Request, Response } from "express";

export const userMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //kjbaf
  const header = req.headers["authorization"];
};
