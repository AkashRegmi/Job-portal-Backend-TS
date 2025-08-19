import express, { Router } from "express";
import {
  createJob,
  getJobById,
  getAllJobs,
  updateJob,
  deleteJob,
  alljobByAdmin,
  alljobAppliedByUser,
  getAllApprovedJObPost,
  getAllRejectedJObPost,
  acceptJobApplication,
  rejectJObApplication,
  getPendingjostPost,
  getAlljostPost,
} from "../../controller/JobController/job";
import { body } from "express-validator";

import validate from "../../middleware/ValidationMiddleware/validatormiddleware";

import {
  authenticateUser,
  adminUser,
  reviewerUser,
} from "../../middleware/AuthMiddleware/authUSer";

import {
  jobValidator,
  updatejobValidator,
} from "../../Validator/JobValidator/jobValidator";

const router: Router = express.Router();

//For Reviewer
router.get("/approvedJobsPost", reviewerUser, getAllApprovedJObPost);
router.get("/rejectedJobsPost", reviewerUser, getAllRejectedJObPost);
router.put("/acceptJob/:id", reviewerUser, acceptJobApplication);
router.put("/rejectJob/:id", reviewerUser, rejectJObApplication);
router.get("/getPendingJobPost", reviewerUser, getPendingjostPost); //This is for Pending Job post
router.get("/getAllJobPost", reviewerUser, getAlljostPost);

//for Admin/Company
router.post("/create", adminUser, jobValidator, createJob);
router.put("/updateJob/:id", adminUser, updatejobValidator, updateJob);
router.delete("/deleteJob/:id", adminUser, deleteJob);

//For USers
// router.post("/create", adminUser,jobValidator ,createJob);
router.get("/getAllJobs", getAllJobs);
// router.get("/getAllJobPost",getalljostPost)
// router.get("/approvedJobsPost",getAllApprovedJObPost);
// router.get("/rejectedJobsPost",getAllRejectedJObPost)
router.get("/getJob/:id", getJobById);
router.get("/alljobByAdmin", authenticateUser, adminUser, alljobByAdmin);
router.get("/alljobAppliedByUser", authenticateUser, alljobAppliedByUser);
// router.put("/updateJob/:id", adminUser,updatejobValidator, updateJob);
// router.delete("/deleteJob/:id", adminUser,deleteJob);
// router.put('/acceptJob/:id',acceptJobApplication);
// router.put("/rejectJob/:id", rejectJObApplication);

export default router;
