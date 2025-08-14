import multer,{FileFilterCallback} from "multer";
import path from "path";
import {Request} from "express";
import { endianness } from "os";


interface UploadOptions{
    folder:string,
    allowedTypes:string[],
    sizeLimit?:number
};

export const creatMUltipleUpload = ({folder,allowedTypes,sizeLimit}:UploadOptions)=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null,folder)
        },
        filename:(req,file,cb)=>{
            const uniqueName = `${Date.now()}_${file.originalname}`;

            cb(null,uniqueName)
        }
    })

    const fileFilter= (req:Request,file:Express.Multer.File,cb:FileFilterCallback)=>{
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
           cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`));
        }
    }
    return multer({
    storage,
    fileFilter,
    limits: sizeLimit ? { fileSize: sizeLimit } : undefined
  });
}
