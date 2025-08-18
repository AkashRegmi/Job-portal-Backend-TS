import mongoose,{Document,Schema,model} from "mongoose";
import { NextFunction } from "express";
import { UserRole } from "../enums/UserRole";
import bcrypt from "bcryptjs"
export interface IUser extends Document {
  name: string;
  role: UserRole;
  email: string;
  password: string;
  
}
//This is making the User Schema 
 const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: Number,
        enum: UserRole,
        default: UserRole.USER, 
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
 },{
    timestamps: true,
 });
 userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error:any) {
        next(error);
    }
});

 const User = mongoose.model<IUser>('User', userSchema);
export default User;
