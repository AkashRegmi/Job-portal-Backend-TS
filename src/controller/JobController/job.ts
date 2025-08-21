import { Request, Response } from "express";
import Job from "../../model/JobModel/Job";
import Application from "../../model/ApplicationModel/Application";
import { JOBSTATUS } from "../../enums/jobStatus";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { JobType } from "../../enums/JobType";
interface createJobBody {
  title: string;
  description: string;
  time: string;
  location: string;
  salary: number;
  company: string;
  jobType: JobType;
  opennings: number;
}

// This is for creating a new job (done)
export const createJob = async (
  req: Request<{}, {}, createJobBody>,
  res: Response
): Promise<Response> => {
  const {
    title,
    description,
    time,
    location,
    salary,
    company,
    jobType,
    opennings,
  } = req.body;

  try {
    const currenttime = new Date(Date.now() - 60 * 1000);
    const existingJob = await Job.findOne({
      title,
      createdAt: { $gte: currenttime },
    });

    if (existingJob) {
      return res.status(400).json({
        success: false,
        message:
          "A job with this title was posted recently. Please wait 1 min before posting again.",
      });
    }
    const jobTime = new Date(time);
    const now = new Date();

    if (jobTime < now) {
      return sendError(res, 400, "Job time Cannot be in Past Date ");
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      company,
      jobType,
      time,
      opennings,
      user: req.user.id,
    });

    await newJob.save();

    return sendSuccess(res, 201, "Job Created Successfully", newJob);
  } catch (error: any) {
    console.error("Error creating job:", error);
    return sendError(res, 500, "Internal Server Error.Cannot Create the JOb ");
  }
};

//This is for getting all jobs (done)
export const getAllJobs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, location, jobType, company, salaryMin, salaryMax } =
      req.query;
    const limit = parseInt(req.query.limit as string) || 8;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      filter.jobType = jobType;
    }
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }
    // if (salaryMin || salaryMax) {
    //   filter.salary = {};
    //   if (salaryMin) filter.salary.$gte = Number(salaryMin);
    //   if (salaryMax) filter.salary.$lte = Number(salaryMax);
    // }
    filter.status = 1;
    filter.time = { $gte: new Date() };
    const jobs = await Job.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const allJobs = await Job.countDocuments();
    const totalJobs = await Job.countDocuments(filter);
    return sendSuccess(res, 200, "Data Fetch Successfully", {
      jobs,
      currentPage: page,
      totalJobs: totalJobs,
      totalpage: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return sendError(res, 500, "Internal Server Error ");
  }
};

// This is for getting a single job by ID (Done)
export const getJobById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const jobId = req.params.id;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 404, "Job not Found");
    }
    return sendSuccess(res, 200, "Job fetch Successfully", job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return sendError(res, 500, "Internal Server Error ");
  }
};

// This is for updating a job by ID  (Done)
export const updateJob = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const jobId = req.params.id;
    const {
      title,
      description,
      location,
      salary,
      company,
      jobType,
      time,
      opennings,
    } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 404, "Job not Found");
    }
    if (job.user.toString() !== req.user?.id) {
      return sendError(res, 403, "You are not authorize to update this job ");
    }
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        location,
        salary,
        company,
        jobType,
        time,
        opennings,
        status: JOBSTATUS.PENDING,
      },
      { new: true }
    );

    return sendSuccess(res, 200, "Job Updated Successfully ", {
      job: updateJob,
    });
  } catch (error) {
    console.error("Error updating job:", error as Error);
    return sendError(res, 500, "Internl Server Error. Error Updating Job  ");
  }
};

// This is for deleting a job by ID (Done)
export const deleteJob = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const jobId = req.params.id;
  try {
    // const job = await Job.findByIdAndDelete(jobId);
    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 404, "Job not Found ");
    }
    if (job.user.toString() !== req.user?.id) {
      return sendError(res, 403, "you are not authorize to delete this job ");
    }
    await Job.findByIdAndDelete(jobId);
    return sendSuccess(res, 200, "Job Deleted Successfully");
  } catch (error) {
    console.error("Error deleting job:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

//All the jobpost by the admin 
export const alljobByAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    return sendError(res, 401, "Unauthorized:User ID not found ");
  }

  try {
    const jobs = await Job.find({ user: userId });

    if (!jobs || jobs.length === 0) {
      return sendError(res, 404, "NO job post found for this Admin");
    }
    return sendSuccess(res, 200, "job Fetched Successfully", jobs);
  } catch (error: any) {
    console.error("Error fetching jobs by admin:", error.message);
    return sendError(res, 500, `Server error: ${error.message}`);
  }
};

//All the job Applied by the user (Done)
export const alljobAppliedByUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    return sendError(res, 401, "Unauthorized: User ID not found in request");
  }

  try {
    const jobs = await Application.find({ user: userId })
      .populate("job", "title company location salary jobType time")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return sendError(res, 404, "No jobs found for this user");
    }

    return sendSuccess(res, 200, "Data Fetched Successfully", jobs);
  } catch (error: any) {
    console.error("Error fetching jobs by user:", error.message);
    return sendError(res, 500, "Internal Server Error ");
  }
};

//Updating the job Status to Approve(done)
export const acceptJobApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const job = await Job.findOneAndUpdate(
      { _id: id, status: { $ne: JOBSTATUS.APPROVE } },
      { status: JOBSTATUS.APPROVE },
      { new: true }
    );

    if (!job) {
      return sendError(res, 400, "Job not found or already approved");
    }

    return sendSuccess(res, 200, "Job is posted to portal", job);
  } catch (error: any) {
    console.log("Error updating the job:", error.message);
    return sendError(res, 500, "Oops! Server is down");
  }
};

//Updating the job Status to the Reject (done)
export const rejectJObApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    const job = await Job.findOneAndUpdate(
      { _id: id, status: { $ne: JOBSTATUS.REJECTED } },
      {
        status: JOBSTATUS.REJECTED,
        rejectionReason: reason || "No Reason is Provided",
      },
      { new: true }
    );
    if (!job) {
      return sendError(res, 404, "Job Not Found or Already Rejected");
    }
    return sendSuccess(res, 200, "Job is Rejected", job);
  } catch (error: any) {
    console.log("Error updating the job ", error.message);
    return sendError(res, 500, "OOPs Server is Down");
  }
};

//getting all the pending job for the Admin (done)
export const getPendingjostPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const job = await Job.find({ status: { $in: [JOBSTATUS.PENDING] } }).sort({createdAt:-1});
  if (!job) {
    return sendError(res, 404, "Cannot find the job");
  }

  return sendSuccess(res, 200, "Data Fetched successfully", job);
};

//Getting all the job Status
export const getAlljostPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const job = await Job.find({
    status: { $in: [JOBSTATUS.PENDING, JOBSTATUS.APPROVE, JOBSTATUS.REJECTED] },
  });
  if (!job) {
    return sendError(res, 404, "Cannot find the job");
  }

  return sendSuccess(res, 200, "Data Fetched successfully", job);
};

//Getting all the approved job (done)
export const getAllApprovedJObPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const job = await Job.find({ status: { $in: [JOBSTATUS.APPROVE] } });
  if (!job) {
    return sendError(res, 404, "Cannot find the job");
  }

  return sendSuccess(res, 200, "Data Fetched successfully", job);
};

// Getting all the Rejected Job (done)
export const getAllRejectedJObPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const job = await Job.find({ status: { $in: [JOBSTATUS.REJECTED] } });
  if (!job) {
    return sendError(res, 404, "Cannot find the job");
  }

  return sendSuccess(res, 200, "Data Fetched successfully", job);
};
