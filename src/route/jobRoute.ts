import express,{Router} from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob} from "../controller/job";
import { body } from "express-validator";
import validate from "../middleware/validatormiddleware";
import {authenticateUser,adminUser} from "../middleware/authUSer"

const normalizeJobType = (value: string) => {
  if (typeof value !== "string") return value;
  return value.trim().toLowerCase().replace(/[_\s]/g, "-");
};

const router: Router = express.Router();

const jobValidator = [

    body("title").notEmpty().withMessage("Title is required").isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
    body("description").notEmpty().withMessage("Description is required").isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters"),
    body("company").notEmpty().withMessage("Company is required").isLength({ min: 2, max: 100 }).withMessage("Company name must be between 2 and 100 characters"),
    body("location").notEmpty().withMessage("Location is required").isLength({ min: 2, max: 100 }).withMessage("Location must be between 2 and 100 characters"),
    body("salary").notEmpty().withMessage("Salary is required").isNumeric().withMessage("Salary must be a number"),
    body("jobType").customSanitizer(normalizeJobType).notEmpty().withMessage("Job type is required").isIn(["full-time", "part-time", "contract", "internship"]).withMessage("Job type must be one of Full-time, Part-time, Contract, or Internship"), 
    body("time").notEmpty().withMessage("Time is required").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Time must be in the format YYYY-MM-DD"),
    validate
];
const updatejobValidator=[
    body("title").optional().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
    body("description").optional().isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters"),
    body("company").optional().isLength({ min: 2, max: 100 }).withMessage("Company name must be between 2 and 100 characters"),
    body("location").optional().isLength({ min: 2, max: 100 }).withMessage("Location must be between 2 and 100 characters"),
    body("salary").optional().isNumeric().withMessage("Salary must be a number"),
    body("jobType").optional().customSanitizer(normalizeJobType).isIn(["full-time", "part-time", "contract", "internship"]).withMessage("Job type must be one of Full-time, Part-time, Contract, or Internship"), 
    body("time").optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Time must be in the format YYYY-MM-DD"),
    validate
]


router.post("/create", adminUser,jobValidator ,createJob);
router.get("/getAllJobs", getAllJobs);
router.get("/getJob/:id", getJobById);
router.put("/updateJob/:id", adminUser,updatejobValidator, updateJob);
router.delete("/deleteJob/:id", adminUser,deleteJob);


export default router;
