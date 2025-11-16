import express, { Router, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { applicationApproval, ApplicationListing, applicationRejection, createApplication, getApplicationCountForJob, getPendingApplication, whoAppliedForTheSpecificJob } from "../../controller/ApplicationController/application";
// import { authenticateUser } from "../../middleware/authUSer";
import { adminUser, authenticateUser } from "../../middleware/AuthMiddleware/authUSer";
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
// router.get("/listing",adminUser,ApplicationListing)
router.get("/applicantForSpecificJob/:jobId",adminUser,whoAppliedForTheSpecificJob)

//This is for the Admin Only 
router.get("/getThePendingApplication",adminUser,getPendingApplication)
router.put("/acceptApplication/:applicationId",adminUser,applicationApproval)
router.put("/rejectApplication/:applicationId",adminUser,applicationRejection)


// router.get("/:jobId", adminUser,getApplicationCountForJob)


export default router;
