import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// import { UserRole } from "../enums/UserRole";
import { UserRole } from "../../enums/UserRole";

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
    return res.status(401).json({
      success: false,
      message: "Unauthorized access token not received",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

//Yo chai for the admin User ko lagi
export const adminUser = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.headers["authorization"]?.toString().split(" ")[1] ||
    req.headers["Authorization"]?.toString().split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access token not received",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    console.log(req.user.role);
    // if(req.user.role === 'admin'){
    if (req.user.role === UserRole.ADMIN) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Only Admin Can Access this",
      });
    }
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid token" });
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
    return res.status(401).json({
      success: false,
      message: "Unauthorized: token not received",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;

    // if (req.user.role === "reviewer") {
    if (req.user.role === UserRole.REVIEWER) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Only Reviewer can access this",
      });
    }
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};
