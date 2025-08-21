import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// import { UserRole } from "../enums/UserRole";
import { UserRole } from "../../enums/UserRole";
import { sendError } from "../../utils/responseHandler";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// This is  for the Only Authenticated User
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers["authorization"]?.toString().split(" ")[1] ||
    req.headers["Authorization"]?.toString().split(" ")[1];
  console.log(token);
  if (!token) {
    return sendError(res, 401, "Unauthorized access token not received");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return sendError(res, 403, "Invalid Token ");
  }
};

//Yo chai for the admin User ko lagi
export const adminUser = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.headers["authorization"]?.toString().split(" ")[1] ||
    req.headers["Authorization"]?.toString().split(" ")[1];
  console.log(token);

  if (!token) {
    return sendError(res, 401, "Unauthorize access token not received");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    console.log(req.user.role);
    // if(req.user.role === 'admin'){
    if (req.user.role === UserRole.ADMIN) {
      next();
    } else {
      return sendError(res, 403, "Only Admin can Access this");
    }
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return sendError(res, 403, "Invalid Token");
  }
};

//This is for the main reviewer of the job
export const reviewerUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers["authorization"]?.toString().split(" ")[1] ||
    req.headers["Authorization"]?.toString().split(" ")[1];

  if (!token) {
    return sendError(res, 401, "Unauthorizes: Token not received");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;

    // if (req.user.role === "reviewer") {
    if (req.user.role === UserRole.REVIEWER) {
      next();
    } else {
      return sendError(res, 403, "Only Reviewer can access this ");
    }
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return sendError(res, 403, "Invalid Token");
  }
};
