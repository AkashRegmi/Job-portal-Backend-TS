import { Request,Response } from "express";
import Job from "../database/Job";

// interface JobRequestquery {
//     limit?: string;
//     page?: string;

// }

// This is for creating a new job
 export const createJob = async (req: Request, res: Response): Promise<Response> => {
  const { title, description, location, salary,company,jobType } = req.body;
  
  try {
    // to do  check the if the doc have the same data 
    if (!title || !description || !location || !salary || !company || !jobType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      company,
      jobType,
      user: req.user.id 
    });

    await newJob.save();
    return res.status(201).json({
        status: 201,
      success: true,
      message: "Job created successfully",
      job: newJob
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Cannot create job"
    });
  }
}

//This is for getting all jobs
 export const getAllJobs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const{title, location, jobType,company,salary} = req.query;
    const limit = parseInt(req.query.limit as string) || 5;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    

    const filter:any = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; 

    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (jobType) {
      filter.jobType = jobType;
    }
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }if (salary) {
      filter.salary = salary;
    }
    
    const jobs = await Job.find(filter).skip(skip).limit(limit).sort({ time: -1 });
    return res.status(200).json({
        status: 200,
      success: true,
      jobs,
      currentPage: page,
        totalJobs: await Job.countDocuments()
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Cannot get all jobs"
    });
  }
}

// This is for getting a single job by ID
 export const getJobById = async (req: Request, res: Response): Promise<Response> => {
  const jobId = req.params.id;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    return res.status(200).json({
        status: 200,
      success: true,
      job
    });
    } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ 
        success: false,
        message: "Internal server error:Cannot get the job by ID"
      })
    }
};

// This is for updating a job by ID
 export const updateJob = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const jobId = req.params.id;
  const { title, description, location, salary } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    };
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,{title, description, location, salary},
    { new: true })
    return res.status(200).json({
        status:200,
      success: true,
      message: "Job updated successfully",
      job: updatedJob
    });
}catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.Error updating the job"
    });
  }
}  

// This is for deleting a job by ID
 export const deleteJob = async (req: Request, res: Response): Promise<Response> => {
  const jobId = req.params.id;
  try {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Job not found"
      });
    }
    return res.status(200).json({
        status: 200,
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
        status: 500,
      success: false,
      message: "Internal server error.Error deleting the job"
    });
  }
}