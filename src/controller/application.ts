import express, { Request, Response } from 'express';
import Application from "../database/Application"
import Job from "../database/Job"
import fs from 'fs';
import {sendError,sendSuccess} from "../utils/responseHandler"

// yi chai job application dina lai 

 export const createApplication = async (req: Request, res: Response): Promise<Response> => {
  try {
    // console.log("Creating application with body:");
    const { jobId} = req.params;
    // console.log('Job ID:', jobId);
    const { phoneNumber } = req.body; 

  //   console.log('Body:', req.body);
  // console.log('File:', req.file);
    const userId = req.user?.id; 
    const userName = req.user?.name;
  if (!userId) {
    if (req.file && req.file.path) {
  fs.unlink(req.file.path, (err) => {
    if (err) console.error("Failed to delete file:", err);
  });
}

      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

      const jobExist = await Job.findById( jobId )
                if(!jobExist) {
                    return res.status(404).json({
                        status: 404,
                        success: false,
                        message: 'Job not found'
                    });
                } 
// console.log(typeof req.user?.id, typeof jobExist.user);
      if(userId === jobExist.user.toString()) {
        
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You cannot apply for your own job"
      });
    }
   
 if(!phoneNumber) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'Phone number is required' 
        })};

          if(phoneNumber.length !== 10 ) {
            return res.status(400).json({
                success: 'failed',
                message: 'Phone number must be 10 digits long'
            });
        }

         if(!req.file || !req.file.path  ) {
        return res.status(400).json({ 
            success: 'failed',
            message: 'CV is required' });
           }



            const applicant = await Application.findOne({ user:userId, job:jobId });
            if(applicant) {
                return res.status(400).json({
                  status: 400,
                    success: false,
                    message: 'You have already applied for this job'
                })
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


   

    return res.status(201).json({
      success: true,
      message: "Job Applied successfully",
      application: newApplication,
    
    });
  } catch (error:any) {
    console.error("Error creating application:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Error creating the application"
    });
  }
};