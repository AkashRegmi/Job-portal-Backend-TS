import express, { Request, Response, NextFunction } from "express";
import Application from "../../model/ApplicationModel/Application";
import Job from "../../model/JobModel/Job";
import fs from "fs";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import validate from "../../middleware/ValidationMiddleware/validatormiddleware";

// yi chai job application dina lai

export const createApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const filepath = req.file?.path;
  try {
    const { jobId } = req.params;
    const { phoneNumber } = req.body;
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

    //  if(!phoneNumber) {
    //         return sendError(res,400,"Phone Number is Required")
    //       };

    //           if(phoneNumber.length !== 10 ) {
    //             return sendError(res,400,"Phone Number must be 10 digit Long ")
    //         }

    if (!req.file || !req.file.path) {
      return sendError(res, 400, "CV is Required");
    }

    const applicant = await Application.findOne({ user: userId, job: jobId });
    if (applicant) {
      return sendError(res, 400, "You already have applied for this job");
    }

    // Create a new application
    const newApplication = new Application({
      user: userId,
      userName,
      job: jobId,
      cv: req.file.path,
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
export const updatingApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { applicationId } = req.params;
    const { phoneNumber } = req.body;
    const userId = req.user?.id;

    // Checking if the user is login or not
    if (!userId) {
      // if (req.file && req.file.path) {
      //   fs.unlink(req.file.path, (err) => {
      //     if (err) console.error("Failed to delete uploaded file:", err);
      //   });
      // }
      return sendError(res, 401, "Unauthorized: User not found");
    }

    // Find application and verify ownership
    const application = await Application.findById(applicationId);
    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    if (application.user.toString() !== userId) {
      return sendError(
        res,
        403,
        "You are not authorized to update this application"
      );
    }

    // Update phone number if provided
    if (phoneNumber) {
      if (phoneNumber.length !== 10) {
        return sendError(res, 400, "Phone Number must be 10 digits long");
      }
      application.phoneNumber = phoneNumber;
    }

    // If new CV uploaded, replace old one
    if (req.file && req.file.path) {
      // Delete old CV file
      if (application.cv && fs.existsSync(application.cv)) {
        fs.unlink(application.cv, (err) => {
          if (err) console.error("Failed to delete old CV:", err);
        });
      }
      application.cv = req.file.path;
    }

    // Save updated application
    const updatedApplication = await application.save();
    await updatedApplication.populate("user", "name email role");
    await updatedApplication.populate("job", "title company location");

    return sendSuccess(
      res,
      200,
      "Application updated successfully",
      updatedApplication
    );
  } catch (error: any) {
    console.error("Error updating application:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};
