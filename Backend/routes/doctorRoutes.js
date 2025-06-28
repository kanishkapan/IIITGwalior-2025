import express from "express";
import {updateAppointmentStatus, updateTimeSlots, getDoctorAppointments} from "../controllers/doctorContoller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch("/slots/update", authMiddleware(["doctor"]), updateTimeSlots);
router.get("/appointment", authMiddleware(["doctor"]), getDoctorAppointments);
router.patch("/:id/appointment-status", authMiddleware(["doctor"]), updateAppointmentStatus);

export default router;