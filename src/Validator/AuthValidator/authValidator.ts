import { body } from "express-validator";
import validate from "../../middleware/ValidationMiddleware/validatormiddleware";
//  This is for the making the password feild much strong
const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
//This is for the registering the new User. Register User garda
export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()

    .withMessage("Password is required")
    // .matches(strongPassword)
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),

  validate,
];

//login garda ko lagi validator
export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    // .matches(strongPassword)
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),

  validate,
];
