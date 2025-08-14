
import express,{Request,Response} from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import authRouter from "./route/authRoute"
import jobRouter from "./route/jobRoute"
import applicationRouter from "./route/applicationRoute";
import { globalerrorhandler } from "./middleware/globalerrorhandler";
import cors from "cors"
dotenv.config();
    
const app = express();
const PORT = process.env.PORT || 4001;
connectDB();
app.use(express.json())
app.use(cors());





app.use("/api/auth",authRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter); 

app.use(globalerrorhandler)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});