import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HttpStatusCode } from "../utils/enums";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};
