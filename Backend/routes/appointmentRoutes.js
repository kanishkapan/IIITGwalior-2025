import express from "express";
import {
  bookAppointment,
  getStudentAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware(["student"]), bookAppointment);
router.get("/student", authMiddleware(["student"]), getStudentAppointments);
router.get("/doctor", authMiddleware(["doctor"]), getDoctorAppointments);
router.patch("/:id/status", authMiddleware(["doctor"]), updateAppointmentStatus);

export default router;
