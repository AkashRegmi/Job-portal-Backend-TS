import express, { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const firstError = result.array()[0];
  res.status(400).json({
    success: false,
    message: firstError.msg,
  });
};

export default validate;
