import express from "express";
import { signup, login, logout, getAllDoctors, getDoctorAvailableTimeSlots } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/doctors", getAllDoctors);
router.get("/doctor/:doctorId/available-slots", getDoctorAvailableTimeSlots);

export default router;
