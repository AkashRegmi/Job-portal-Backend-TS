import express, { Request, Response, NextFunction } from "express";
import fs from "fs";

import { validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  if (result) {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        console.log(`Error deleting the file ${err?.message}`);
      });
    } else {
      console.log(`File Deleted Successfully`);
    }
  }
  const firstError = result.array()[0];
  res.status(400).json({
    success: false,
    message: firstError.msg,
  });
};

export default validate;
