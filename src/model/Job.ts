import mongoose, { Document, Schema, model } from "mongoose";
import { JobType } from "../enums/JobType";
import { JOBSTATUS } from "../enums/jobStatus";
export interface IJob extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  jobType: JobType;
  time: Date;
  opennings: number;
  status: JOBSTATUS;
}

const jobSchema = new Schema<IJob>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: Number,
      // enum: Object.values(JobType),
      enum: JobType,
      required: true,
      default: JobType.FULL_TIME,
      trim: true,
      lowercase: true,
    },
    time: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    opennings: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      enum: JOBSTATUS,
      default: JOBSTATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);
const Job = mongoose.model<IJob>("Job", jobSchema);
export default Job;
