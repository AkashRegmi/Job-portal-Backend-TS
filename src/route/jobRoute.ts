import express,{Router} from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob,alljobByAdmin,alljobAppliedByUser,  rejectJObStatus, acceptJobStatus, getalljostPost} from "../controller/job";
import { body } from "express-validator";
import validate from "../middleware/validatormiddleware";
import {authenticateUser,adminUser} from "../middleware/authUSer";
import { jobValidator, updatejobValidator } from "../Validator/jobValidator";



const router: Router = express.Router();




router.post("/create", adminUser,jobValidator ,createJob);
router.get("/getAllJobs", getAllJobs);
router.get("/getAllJobPost",getalljostPost)
router.get("/getJob/:id", getJobById);
router.get("/alljobByAdmin", authenticateUser, adminUser, alljobByAdmin);
router.get("/alljobAppliedByUser", authenticateUser, alljobAppliedByUser);
router.put("/updateJob/:id", adminUser,updatejobValidator, updateJob);
router.delete("/deleteJob/:id", adminUser,deleteJob);
router.put('/acceptJob/:id',acceptJobStatus);
router.put("/rejectJob/:id", rejectJObStatus)




export default router;
