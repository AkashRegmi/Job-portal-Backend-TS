import express ,{Router,Request,Response} from "express";
import multer ,{FileFilterCallback}from "multer";
import { createApplication } from "../controller/application";
import { authenticateUser } from "../middleware/authUSer" ;

import Job from "..//database/Job"

const router:Router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

const upload = multer({ storage, fileFilter });




router.post("/apply/:jobId", authenticateUser,upload.single('cv'),createApplication);

export default router;



