import {Request, Response} from 'express';
import User from "../database/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
     
    if(!name || !email || !password){
        return res.status(400).json({
            success:"false",
            message:"Must Provide the required feild name email and Password"
        });
    };
   
    const existinguser = await User.findOne({email});
    if(existinguser){
        return res.status(400).json({
            success:"false",
            message:"User Already Exist. Please SignIn"
        })
    };
    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();
     return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
      }
    });
   } catch (error:any) {
    console.error('Error registering user:', error.message);
    return res.status(500).json({ message: `Server error: ${error.message}` });
   }
};


export const login = async (req:Request<{},{},LoginRequestBody>,res:Response):Promise<Response>=>{
    
         const {email, password}=  req.body;
    try {
        
if (!email || !password) {
      return res.status(400).json({
        success: 'failed',
        message: 'Please provide both email and password',
      });
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:"False",
            message:`${email} not found. Please Sign up`
        })
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: 'failed',
        message: 'Invalid password',
      });
      
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
     return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    } catch (error:any) {
         console.error('Error during login:', error.message);
    return res.status(500).json({ message: `Server error: ${error.message}` });
    }
   

}