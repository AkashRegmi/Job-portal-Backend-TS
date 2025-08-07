import express ,{Router} from "express"
import { registerUser,login } from "../controller/auth";
import {body} from "express-validator"
import validate from "../middleware/validatormiddleware"
const router:Router = express.Router();

// Validation rules for registration
const registerValidator = [
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
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),

  validate
];

//validation for the Login 
const loginValidator = [

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),

  validate
];



 router.post("/register", registerValidator,registerUser)
 router.post("/login",loginValidator,login)

 export default router;
