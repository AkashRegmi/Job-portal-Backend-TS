import mongoose,{Document,Schema,model} from "mongoose";
import bcrypt from "bcryptjs"
export interface IUser extends Document {
  name: string;
  role: 'user' | 'admin';
  email: string;
  password: string;
  
}
 const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        toLowerCase: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
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
