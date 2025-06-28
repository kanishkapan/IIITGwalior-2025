import express from "express";
import userRouter from "./userRoute.js";
import medicalLeaveRouter from "./medicalLeaveRoute.js";
import healthRecordRouter from "./healthRecordRoutes.js";
import appointmentRouter from "./appointmentRoutes.js";

const router = express.Router();

// Routes

// For debugging purposes
// router.use("/user", (req, res, next) => {
//     console.log("Users route hit!");
//     next();
//   });

router.use("/user", userRouter);
router.use("/leave", medicalLeaveRouter);
router.use("/health-record", healthRecordRouter);
router.use("/appointment", appointmentRouter);

export default router;