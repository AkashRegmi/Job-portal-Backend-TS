import { Request, Response } from "express";
import User from "../../model/UserModel/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { UserRole } from "../../enums/UserRole";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  // role?: 'user' | 'admin';
  role?: UserRole;
}
interface LoginRequestBody {
  email: string;
  password: string;
}

interface jwtPayload {
  id: string;
  email: string;
  name: string;
  // role?: "user"|"admin"
  role?: UserRole;
}

//This is for the registering the new User
export const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<Response> => {
  const { name, email, password, role = UserRole.USER } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return sendError(res, 400, "User Already Exist. Please SignIn ");
    }
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    // await newUser.save();
    return sendSuccess(res, 201, "User Register Successfully", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      // role: UserRole,
    });
  } catch (error: any) {
    console.error("Error registering user:", error.message);
    return sendError(res, 500, `Server Error ${error.message}`);
  }
};

//This is for the Login of the existing User
export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 400, `${email} not Found. Please Sign UP.`);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid Password");
    }
    // This is for generating the Token While log in
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      } as jwtPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    return sendSuccess(res, 200, "Login Successfull", {
      token,
    });
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return sendError(res, 500, `Server Error ${error.message}`);
  }
};
