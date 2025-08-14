import express, { Request, Response } from 'express';
import Application from "../model/Application"
import Job from "../model/Job"
import fs from 'fs';
import {sendError,sendSuccess} from "../utils/responseHandler"

// yi chai job application dina lai 

 export const createApplication = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { jobId} = req.params;
    const { phoneNumber } = req.body; 
    const userId = req.user?.id; 
    const userName = req.user?.name;
    
    //for checking if there is the User Exist 
  if (!userId) {
    if (req.file && req.file.path) {
  fs.unlink(req.file.path, (err) => {
    if (err) console.error("Failed to delete file:", err);
  });
}
      // return res.status(401).json({
      //   success: false,
      //   message: "Unauthorized: User not found",
      // });
      return sendError(res,401,"Unauthorize: User Not Found");
    }

      const jobExist = await Job.findById( jobId )
                if(!jobExist) {
                    return sendError(res,404,"job Not Found")
                } 
// console.log(typeof req.user?.id, typeof jobExist.user);
      if(userId === jobExist.user.toString()) {
      return sendError(res,403,"You Cannot apply for your own job")
    }
   
 if(!phoneNumber) {
        return sendError(res,400,"Phone Number is Required")
      };

          if(phoneNumber.length !== 10 ) {
            return sendError(res,400,"Phone Number must be 10 digit Long ")
        }

         if(!req.file || !req.file.path  ) {
            return sendError(res,400,"CV is Required")
           }



            const applicant = await Application.findOne({ user:userId, job:jobId });
            if(applicant) {
                return sendError(res,400,"You already have applied for this job")
              }

              
    // Create a new application
    const newApplication = new Application({
        user: userId,
             userName,
            job: jobId,
            cv:req.file.path,
            phoneNumber,
      
    });

    const savedApplication = await newApplication.save();
    await savedApplication.populate('user', 'name email role');
    await savedApplication.populate('job', 'title company location');
    return sendSuccess(res,201,"Job Applied Successfully",newApplication)
  } catch (error:any) {
    console.error("Error creating application:", error);
    return sendError(res,500,"Internal Server Error")
  }
};