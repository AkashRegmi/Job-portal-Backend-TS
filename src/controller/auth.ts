import {Request, Response} from 'express';
import User from "../database/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {sendError, sendSuccess} from "../utils/responseHandler"


interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};
interface LoginRequestBody {
  email: string;
  password: string;
};

interface jwtPayload {
  id: string;
    email: string;
    name: string;
    role?: "user"|"admin"
};

//This is for the registering the new User
export const registerUser = async (req:Request<{},{},RegisterRequestBody>,res:Response):Promise<Response> =>{
    const {name,email,password,role='user'}=req.body;
   try {
   
    const existinguser = await User.findOne({email});
    if(existinguser){
        return res.status(400).json({
            success:"false",
            message:"User Already Exist. Please SignIn"
        })
    };
    const newUser =   await User.create({
      name,
      email,
      password,
      role,
    });

    // await newUser.save();
    return sendSuccess(res,201,"User Register Successfully",{
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
    } )
   } catch (error:any) {
    console.error('Error registering user:', error.message);
    // return res.status(500).json({ message: `Server error: ${error.message}` });
     return sendError(res,500,`Server Error ${error.message}`)
   }
};

//This is for the Login of the User
export const login = async (req:Request<{},{},LoginRequestBody>,res:Response):Promise<Response>=>{
    
         const {email, password}=  req.body;
    try {
      
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:"False",
            message:`${email} not found. Please Sign up`
        })
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // return res.status(401).json({
      //   success: 'failed',
      //   message: 'Invalid password',
      // });
       return sendError(res,401,"Invalid Password")
      
    };
    //GEnerating the Token 
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      } as jwtPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    //  return res.status(200).json({
    //   message: 'Login successful',
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //   },
    // });
    return sendSuccess(res,200,"Login Successfull",{
       id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
    })
    } catch (error:any) {
         console.error('Error during login:', error.message);
    // return res.status(500).json({ message: `Server error: ${error.message}` });
    return sendError(res,500,`Server Error ${error.message}`)
    }
   

}
