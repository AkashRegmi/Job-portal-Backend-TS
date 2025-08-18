import { body } from "express-validator";
import validate from "../middleware/validatormiddleware";

export const applicationValidator = [
  body("phoneNumber")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("phoneNumber is required")
    .isInt({ min: 1000000000, max: 9999999999 })
    .withMessage("Phone Number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone Number must contain only numbers"),
  validate,
];
