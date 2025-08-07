import express, { Request, Response, NextFunction } from 'express';
import Application from "../database/Application"
import Job from "../database/Job"

// yi chai job application dina lai 

 export const createApplication = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { jobId, phoneNumber} = req.body;
    const userId = req.user?.id; 

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    if(!phoneNumber){
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Phone number is required to apply for the job"
      })
    }
    // Create a new application
    const newApplication = new Application({
      jobId,
      
    });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Job Applied successfully",
      application: newApplication
    });
  } catch (error:any) {
    console.error("Error creating application:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Error creating the application"
    });
  }
}