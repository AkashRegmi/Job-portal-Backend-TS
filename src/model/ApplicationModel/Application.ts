import mongoose, { Document, Schema, model } from "mongoose";
import { APPLICATIONSTATUS } from "../../enums/ApplicationStatus";
export interface IApplication extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user
  job: mongoose.Types.ObjectId; // Reference to the job
  cv: string;
  email:string,
  phoneNumber: string;
  status?:APPLICATIONSTATUS
}

const applicationSchema = new Schema<IApplication>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    email:{
      type:String,
      required:true
    },
    cv: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status:{
      type:Number,
      enum:APPLICATIONSTATUS,
      default:APPLICATIONSTATUS.PROCESSING
    }
  },
  {
    timestamps: true,
  }
);
const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);
export default Application;
