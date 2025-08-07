import mongoose ,{Document,Schema,model} from "mongoose";
export interface IJob extends Document {                                                
user: mongoose.Types.ObjectId; // Reference to the user who posted the job
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  jobType: 'full-time' | 'part-time' | 'contract';
  time:Date,
 
}

const jobSchema = new Schema<IJob>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time',
    },
    time: {
        type: Date,
        default: Date.now,
    },

},{
    timestamps: true,
})
const Job = mongoose.model<IJob>('Job', jobSchema);
export default Job;
