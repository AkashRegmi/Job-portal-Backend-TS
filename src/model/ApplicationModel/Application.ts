import mongoose, { Document, Schema, model } from "mongoose";
export interface IApplication extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user
  job: mongoose.Types.ObjectId; // Reference to the job
  cv: string;
  phoneNumber: string;
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
    cv: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
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
