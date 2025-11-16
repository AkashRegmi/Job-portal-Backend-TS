import express, { Request, Response, NextFunction } from "express";
import Application from "../../model/ApplicationModel/Application";
import Job from "../../model/JobModel/Job";
import fs from "fs";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import validate from "../../middleware/ValidationMiddleware/validatormiddleware";
import { APPLICATIONSTATUS } from "../../enums/ApplicationStatus";
import { sendingRejectionEmail } from "../../utils/nodemailer/emailService";

//FOR USER
// yi chai job application dina lai
export const createApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const filepath = req.file?.path;
  try {
    console.log(req.files, req.body);

    const { jobId } = req.params;
    const { phoneNumber } = req.body;
    const email = req.body.email;
    const userId = req.user?.id;
    const userName = req.user?.name;

    //for checking if there is the User Exist
    if (!userId) {
      return sendError(res, 401, "Unauthorize: User Not Found");
    }

    const jobExist = await Job.findById(jobId);
    if (!jobExist) {
      return sendError(res, 404, "job Not Found");
    }
    // console.log(typeof req.user?.id, typeof jobExist.user);
    if (userId === jobExist.user.toString()) {
      return sendError(res, 403, "You Cannot apply for your own job");
    }
    if (!req.file || !req.file.path) {
      return sendError(res, 400, "CV is Required");
    }

    const applicant = await Application.findOne({ user: userId, job: jobId });
    if (applicant) {
      return sendError(res, 400, "You already have applied for this job");
    }

    const filePath = req.file.path.replace(/\\/g, "/");
    // Create a new application
    const newApplication = new Application({
      user: userId,
      userName,
      job: jobId,
      email,
      // cv: req.file.path,
      cv: filePath,
      phoneNumber,
    });
    await newApplication.save();
    // const savedApplication = await newApplication.save();
    // await savedApplication.populate("user", "name email role");
    // await savedApplication.populate("job", "title company location");
    return sendSuccess(res, 201, "Job Applied Successfully", newApplication);
  } catch (error: any) {
    console.error("Error creating application:", error);
    if (filepath) {
      fs.unlink(filepath, (err) => {
        console.log(`Error Deleting the file ${err?.message}`);
      });
    } else {
      console.log("Successfully deleted File");
    }
    return sendError(res, 500, "Internal Server Error");
  }
};

//This is for the Updating the Application
// export const updatingApplication = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { applicationId } = req.params;
//     const { phoneNumber } = req.body;
//     const userId = req.user?.id;

//     // Checking if the user is login or not
//     if (!userId) {
//       return sendError(res, 401, "Unauthorized: User not found");
//     }

//     // Find application and verify ownership
//     const application = await Application.findById(applicationId);
//     if (!application) {
//       return sendError(res, 404, "Application not found");
//     }

//     if (application.user.toString() !== userId) {
//       return sendError(
//         res,
//         403,
//         "You are not authorized to update this application"
//       );
//     }

//     // Update phone number if provided
//     if (phoneNumber) {
//       if (phoneNumber.length !== 10) {
//         return sendError(res, 400, "Phone Number must be 10 digits long");
//       }
//       application.phoneNumber = phoneNumber;
//     }

//     // If new CV uploaded, replace old one
//     if (req.file && req.file.path) {
//       // Delete old CV file
//       if (application.cv && fs.existsSync(application.cv)) {
//         fs.unlink(application.cv, (err) => {
//           if (err) console.error("Failed to delete old CV:", err);
//         });
//       }
//       application.cv = req.file.path;
//     }

//     // Save updated application
//     const updatedApplication = await application.save();
//     await updatedApplication.populate("user", "name email role");
//     await updatedApplication.populate("job", "title company location");

//     return sendSuccess(
//       res,
//       200,
//       "Application updated successfully",
//       updatedApplication
//     );
//   } catch (error: any) {
//     console.error("Error updating application:", error);
//     return sendError(res, 500, "Internal Server Error");
//   }
// };

// export const getApplicationCountForJob = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { jobId } = req.params;
//     const id = req.user.id;
//     if (!jobId) {
//       return sendError(res, 400, "Job id is Required");
//     }

//     const job = await Job.findById(jobId);
//     if (!job) {
//       return sendError(res, 404, "Job not found");
//     }
//     if (job.user.toString() !== id.toString()) {
//       return sendError(
//         res,
//         403,
//         "You are not authorized to view applicants for this job"
//       );
//     }
//     const applicants = await Application.find({ job: jobId })
//       .populate("user", "name  email")
//       .populate("job")
//       .select("cv phoneNumber createdAt");
//     const count = applicants.length;
//     return sendSuccess(res, 200, "data Fetched Successfully", {
//       jobId,
//       totalApplicants: count,
//       applicants,
//     });
//   } catch (error: any) {
//     console.log(`Error Fetching the total Applicant ${error.message}`);
//     return sendError(res, 500, "Internal Server Error! Server is Down ");
//   }
// };

//listing of JOb
// export const ApplicationListing = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const id = req.user.id;
//   const listing = await Application.find()
//     .populate("user", "name email")
//     .populate({
//       path: "job",
//       match: { user: id },
//     });
//   if (!listing) {
//     return sendError(res, 400, "Job listing not Found ");
//   }
//   return sendSuccess(res, 200, "Listing fetch Successfully", listing);
// };

//THIS IS FOR THE ADMIN

//This is for who applied for the job
export const whoAppliedForTheSpecificJob = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { jobId } = req.params;
  const userId = req.user?.id;
  try {
    const job = await Job.find({ _id: jobId, user: userId });
    if (!job) {
      return sendError(res, 400, "No Such Job Found ");
    }
    const application = await Application.find({ job: jobId })
      .populate("user", "name email")
      .populate("job", "title");
    if (!application) {
      return sendError(res, 400, "Job id is not found in the Application ");
    }
    return sendSuccess(res, 200, "Data Fetched SuccessFully", application);
  } catch (error: any) {
    console.log(error.message);
    return sendError(res, 500, `Internal Server Error ${error.message}`);
  }
};

//This is for the getting the Pending Application
export const getPendingApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.user?.id;

  const applications = await Application.find({
    status: { $in: [APPLICATIONSTATUS.PROCESSING] },
  })
    .select("job")
    .populate({ path: "job", select: "user title" })
    .populate({ path: "user", select: "name" })
    .lean<
      {
        _id: string;
        job: { _id: string; user: string } | null;
      }[]
    >();

  // Filter only applications for jobs owned by logged-in user
  const userApplications = applications.filter(
    (app) => app.job?.user.toString() === userId
  );

  if (!userApplications) {
    return sendError(
      res,
      401,
      "You are not authorized for listing  applications list."
    );
  }

  const filteredProcessingData = await Application.findOne({
    status: { $in: [APPLICATIONSTATUS.PROCESSING] },
  })
    .select("job")
    .populate({ path: "job", select: "user title" })
    .populate({ path: "user", select: "name" });
  if (!filteredProcessingData) {
    return sendError(
      res,
      404,
      "Pending Application not found Looks Like All thing is Cleared "
    );
  }
  return sendSuccess(
    res,
    200,
    "Listing is Fetched Successfully ",
    filteredProcessingData
  );
};
//This is for Approval Of Application
export const applicationApproval = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const applicationId = req.params.applicationId;
  const userId = req.user.id;
  try {
    const application = await Application.findById(applicationId)
      .select("job")
      .populate({
        path: "job",
        select: "user",
      })
      .lean<{
        _id: string;
        job: {
          _id: string;
          user: string;
        };
      }>();

    console.log(application);

    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    // Checking if logged-in user owns this job
    if (application.job.user.toString() !== userId.toString()) {
      return sendError(res, 403, "Not authorized to update this application");
    }
    const application1 = await Application.findOneAndUpdate(
      { _id: applicationId, status: { $ne: APPLICATIONSTATUS.ACCEPTEDD } },
      { status: APPLICATIONSTATUS.ACCEPTEDD },
      { new: true }
    ).populate("user job");
    if (!application1) {
      return sendError(res, 400, "Job is not found or Already approved ");
    }
    return sendSuccess(res, 200, "Application Status Approved", application1);
  } catch (error: any) {
    console.log(`Error Accepting the application ${error.message}`);
    return sendError(res, 500, "Internal Server Error");
  }
};

//This is for the Rejection of the Application
export const applicationRejection = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId;
  const userId = req.user.id;
  try {
    // const application = await Application.findById(applicationId).populate(
    //   "job"
    // );
    const application = await Application.findById(applicationId)
      .select("job user")
      // .populate({
      //   path: "job",
      //   select: "user",
      // })
      .populate([
        { path: "user", select: "name email" },
        { path: "job", select: "user" },
      ])
      // .lean<{
      //   job: {
      //     _id: string;
      //     user: string;
      //   };
      // }>();
      .lean<{ user: { name: string; email: string }; job: { user: string } }>();
    console.log(application);
    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    // 2. Checking if logged-in user owns this job
    if (application.job?.user.toString() !== userId.toString()) {
      return sendError(res, 403, "Not authorized to update this application");
    }
    const updateApplication = await Application.findOneAndUpdate(
      { _id: applicationId, status: { $ne: APPLICATIONSTATUS.DECLINED } },
      { status: APPLICATIONSTATUS.DECLINED },
      { new: true }
    ).populate("user job");
    if (!updateApplication) {
      return sendError(res, 400, "Job is not found or Already Rejected ");
    }
    await sendingRejectionEmail(application.user.email, application.user.name);
    return sendSuccess(
      res,
      400,
      "Application Status Rejected",
      updateApplication
    );
  } catch (error: any) {
    console.log(`Error Rejecting the application ${error.message}`);
    return sendError(res, 500, "Internal Server Error");
  }
};
