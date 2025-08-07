import express ,{Router,Request,Response} from "express";
import multer from "multer";
import { createApplication } from "../controller/application";
import { authenticateUser } from "../middleware/authUSer" ;

const router:Router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req:Request, file, cb) => { 
//     cb(null, 'uploads/'); 
//   },



//   filename: (req:Request, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() +file.originalname);

// }})




router.post("/create", authenticateUser,createApplication);

export default router;



