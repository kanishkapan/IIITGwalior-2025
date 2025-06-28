import express from "express";
import { getUserNotifications } from "../controllers/notificationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/",authMiddleware(["student","doctor","admin"]), getUserNotifications);

export default router;
