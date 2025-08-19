import express, { Request, Response } from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import authRouter from "./route/AuthRoute/authRoute";
import jobRouter from "./route/JobRoute/jobRoute";
import applicationRouter from "./route/ApplicationRoute/applicationRoute";
import { globalerrorhandler } from "./middleware/GlobalErrorHandler/globalerrorhandler";
import cors from "cors";
import { sendError } from "./utils/responseHandler";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
connectDB();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);

//for any route that is not in the application
app.all(/.*/, (req: Request, res: Response) => {
  return sendError(res, 404, `Route  not found`);
});

app.use(globalerrorhandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
