import express, { Router, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { createApplication } from "../../controller/ApplicationController/application";
// import { authenticateUser } from "../../middleware/authUSer";
import { authenticateUser } from "../../middleware/AuthMiddleware/authUSer";
import { creatMUltipleUpload } from "../../utils/uploads";
import { applicationValidator } from "../../Validator/ApplicationValidator/applicationValidator";
import Job from "../../model/JobModel/Job";

const router: Router = express.Router();
const uploadCV = creatMUltipleUpload({
  folder: "uploads/cv",
  allowedTypes: ["application/pdf"],
});

router.post(
  "/apply/:jobId",
  authenticateUser,
  uploadCV.single("cv"),
  applicationValidator,
  createApplication
);
export default router;
