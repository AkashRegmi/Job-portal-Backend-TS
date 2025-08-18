import { body } from "express-validator";
import validate from "../middleware/validatormiddleware";
import { JobType } from "../enums/JobType";

// const normalizeJobType = (value: string) => {
//   if (typeof value !== "string") return value;
//   return value.trim().toLowerCase().replace(/[_\s]/g, "-");
// };
//["full-time", "part-time", "contract", "internship"]
//  export const jobValidator = [

//     body("title").notEmpty().withMessage("Title is required").isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
//     body("description").notEmpty().withMessage("Description is required").isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters"),
//     body("company").notEmpty().withMessage("Company is required").isLength({ min: 2, max: 100 }).withMessage("Company name must be between 2 and 100 characters"),
//     body("location").notEmpty().withMessage("Location is required").isLength({ min: 2, max: 100 }).withMessage("Location must be between 2 and 100 characters"),
//     body("salary").notEmpty().withMessage("Salary is required").isNumeric().withMessage("Salary must be a number"),
//     body("jobType").customSanitizer(normalizeJobType).notEmpty().withMessage("Job type is required").isIn([JobType]).withMessage("Job type must be one of Full-time, Part-time, Contract, or Internship"),
//     body("time").notEmpty().withMessage("Time is required").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Time must be in the format YYYY-MM-DD"),
//     body("opennings").notEmpty().withMessage("Openings jobs are required").trim().isNumeric().isInt({min: 1}).withMessage("Openings must be a positive integer").toInt().withMessage("Openings must be a whole number"),
//     validate
// ];
export const jobValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("company")
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isNumeric()
    .withMessage("Salary must be a number"),
  body("jobType")
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(Object.values(JobType))
    .withMessage("Invalid Job Type"),
  body("time")
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Time must be in the format YYYY-MM-DD"),
  body("opennings")
    .notEmpty()
    .withMessage("Openings jobs are required")
    .trim()
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage("Openings must be a positive integer")
    .toInt()
    .withMessage("Openings must be a whole number"),
  validate,
];

export const updatejobValidator = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("company")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),
  body("location")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("salary").optional().isNumeric().withMessage("Salary must be a number"),
  body("jobType")
    .optional()
    .isIn(Object.values(JobType))
    .withMessage("Invalid Job Type"),
  body("time")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Time must be in the format YYYY-MM-DD"),
  body("opennings")
    .optional()
    .isNumeric()
    .withMessage("Openings must be a number"),
  validate,
];
