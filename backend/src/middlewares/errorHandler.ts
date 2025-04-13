import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../utils/enums";

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (err: CustomError, _req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: err.message || "Server Error" });
  next(); 
};

