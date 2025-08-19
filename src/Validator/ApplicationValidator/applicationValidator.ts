import { body, validationResult } from "express-validator";
import validate from "../../middleware/ValidationMiddleware/validatormiddleware";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

export const applicationValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("phoneNumber is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number must be exactly 10 digits")
    .isString(),
  validate,
];

// Extend Express Request type to include 'file'




// export const validateAndCleanFile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     if (req.file?.path) {
//       fs.unlink(req.file.path, (err) => {
//         console.log(`Error deleting the file ${err?.message}`);
//       });
//     } else {
//       console.log("File Deleted SuccessFully");
//     }
//   }
// };
