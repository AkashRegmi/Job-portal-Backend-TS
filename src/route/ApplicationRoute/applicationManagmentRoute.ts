import Express,{Router} from "express";
import { adminUser } from "../../middleware/AuthMiddleware/authUSer";
import { applicationApproval } from "../../controller/ApplicationController/application";
const router :Router = Express.Router();

// router.put("/acceptApplication/:applicationId",adminUser,applicationApproval)

export default router;

