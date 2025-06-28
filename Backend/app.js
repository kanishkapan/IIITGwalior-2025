import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/database.js";
import userRouter from "./routes/userRoute.js";
import medicalLeaveRouter from "./routes/medicalLeaveRoute.js";
import healthRecordRouter from "./routes/healthRecordRoutes.js";
//import jobRouter from "./routes/jobRoute.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Update this URL as needed
    credentials: true,
  })
);

// Routes
app.use("/api/user", (req, res, next) => {
    console.log("Users route hit!");
    next();
  });
  
app.use("/api/v1/user", userRouter);
app.use("/api/v1/leave", medicalLeaveRouter);
app.use("/api/v1/health-record", healthRecordRouter);
//app.use("/api/v1/jobs", jobRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
