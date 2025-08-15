import {body} from "express-validator";
import validate from "../middleware/validatormiddleware";

export const applicationValidator= [
    body("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone Number must contain only numbers"),
    validate
]