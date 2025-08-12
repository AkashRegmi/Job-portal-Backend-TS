import { Request,Response } from "express";
import Job from "../database/Job";
import Application from "../database/Application";
import { JOBSTATUS } from "../enums/jobStatus";
import {sendError,sendSuccess} from "../utils/responseHandler"



// This is for creating a new job
 export const createJob = async (req: Request, res: Response): Promise<Response> => {
  const { title, description, time,location, salary, company, jobType,opennings } = req.body;
  
  try {
    const currenttime = new Date(Date.now() - 60 * 1000);
     const existingJob = await Job.findOne({
      title,
      createdAt: { $gte: currenttime }
    });

    if (existingJob) {
      return res.status(400).json({
        success: false,
        message: "A job with this title was posted recently. Please wait 1 min before posting again."
      });
    }
    const jobTime = new Date(time);
    const now = new Date();

if (jobTime < now) {
  return res.status(400).json({
    success: false,
    message: "Job time cannot be in the past."
  });
}
   
    const newJob =  new   Job({
      title,
      description,
      location,
      salary,
      company,
      jobType,
      time,
      opennings,
      
      user: req.user.id ,
     
    });

    await newJob.save();
    return res.status(201).json({
        status: 201,
      success: true,
      message: "Job created successfully",
      job: newJob
    });
    // return sendSuccess(res,201,"Job Created Successfully",newJob)

  } catch (error : any ) {
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
    const { title, location , jobType, company, salaryMin, salaryMax } = req.query;
    const limit = parseInt(req.query.limit as string)||5;
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
    }
    if (salaryMin || salaryMax) {
  filter.salary = {};
  if (salaryMin) filter.salary.$gte = Number(salaryMin);
  if (salaryMax) filter.salary.$lte = Number(salaryMax);
}
// filter.status = 1;
    
    const jobs = await Job.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    return res.status(200).json({
        status: 200,
      success: true,
      jobs,
      currentPage: page,
        totalJobs: await Job.countDocuments(filter)
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
        status:404,
        message: "Job not found"
      });
    };
      if (job.user.toString() !== req.user?.id) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You are not authorized to update this job"
      });
    }
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,{title, description, location, salary},
    { new: true })
    return res.status(200).json({
        status:200,
      success: true,
      message: "Job updated successfully",
      job: updatedJob
    });
}catch (error  ) {
    console.error("Error updating job:", error as Error);
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
    // const job = await Job.findByIdAndDelete(jobId);
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Job not found"
      });
    }
      if (job.user.toString() !== req.user?.id) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You are not authorized to delete this job"
      });
    }
    await Job.findByIdAndDelete(jobId);
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

//All the jobpost by the admin 
export const alljobByAdmin = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User ID not found in request",
    });
  }

  try {
    const jobs = await Job.find({ user: userId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No jobs Post found for this Admin",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      jobs,
    });
  } catch (error: any) {
    console.error("Error fetching jobs by admin:", error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

//All the job Applied by the user 
export const alljobAppliedByUser = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: 'failed',
      message: "Unauthorized: User ID not found in request",
    });
  }

  try {
    const jobs = await Application.find({ user: userId }).populate("job",'title company location salary jobType time').populate('user','name email').sort({createdAt:-1});

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        status: 404,
        success: 'failed',
        message: 'No jobs found for this user',
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      jobs,
    });
  } catch (error: any) {
    console.error('Error fetching jobs by user:', error.message);
    return res.status(500).json({
      success: 'failed',
      message: `Server error: ${error.message}`,
    });
  }
};

//Updating the job Status to Approve

export const acceptJobStatus = async (req:Request,res:Response):Promise<Response> =>{
  const {id} = req.params;

  try {
    const job = await Job.findOneAndUpdate(
      { _id: id, status: JOBSTATUS.PENDING },
      { status: JOBSTATUS.APPROVE },
      { new: true }
    );
    if (!job){
      return sendError(res,404,"Job Not Found");
    }
    return sendSuccess(res,200,"Job is Posted to Portal",job);
  } catch (error : any) {
    console.log("Error updating the job ", error.message);
    return sendError(res,500,"OOPs Server is Down");
  }
}

//Updating the job Status to the Reject 
export const rejectJObStatus = async(req:Request,res:Response):Promise<Response>=>{
  const {id} = req.params;
  try {
    const job = await Job.findOneAndUpdate(
      { _id: id, status: JOBSTATUS.PENDING },
      { status: JOBSTATUS.REJECTED },
      { new: true }
    );
    if (!job){
      return sendError(res,404,"Job Not Found");
    }
    return sendSuccess(res,200,"Job is Rejected",job);
  } catch (error : any) {
    console.log("Error updating the job ", error.message);
    return sendError(res,500,"OOPs Server is Down");
  }
}

export const  getalljostPost = async (req:Request,res:Response):Promise<Response>=>{

const job = await Job.find({status:{ $in: [JOBSTATUS.APPROVE, JOBSTATUS.PENDING, JOBSTATUS.REJECTED] }})
if(!job){
  return sendError(res,404,"Cannot find the job")
}
return sendSuccess(res,200,"Data Fetched successfully",job)
}