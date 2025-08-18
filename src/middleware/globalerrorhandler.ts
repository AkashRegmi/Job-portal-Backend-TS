import express, { Request, Response, NextFunction } from "express";
interface customError extends Error {
  statusCode?: number;
}

export const globalerrorhandler = (
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error Handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
