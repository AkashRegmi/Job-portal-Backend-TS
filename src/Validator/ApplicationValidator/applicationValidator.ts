import { body, validationResult } from "express-validator";
import validate from "../../middleware/ValidationMiddleware/validatormiddleware";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

export const applicationValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("phoneNumber is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number must be exactly 10 digits")
    .isString(),
  validate,
];

