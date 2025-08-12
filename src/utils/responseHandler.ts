import {Response } from "express";

interface ApiResponse{
    status:number,
    success:boolean,
    message:string,
    data?:any
};


export const sendError = (res:Response,status:number,message:string ):Response<ApiResponse>=>{
    return res.status(status).json({
        status,
        success:false,
        message,

    } as ApiResponse)
};

export const sendSuccess=(res:Response,status:number,message:string,data?:any):Response<ApiResponse>=>{
    return res.status(status).json({
        status,
        success:true,
        message,
        data
    } as ApiResponse) 
};


