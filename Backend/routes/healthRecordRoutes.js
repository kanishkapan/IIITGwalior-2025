import express from "express";
import {
  createHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
} from "../controllers/healthRecordController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for student health records
router.post("/", authMiddleware(["student"]), createHealthRecord);
router.get("/", authMiddleware(["student"]), getHealthRecords);
router.get("/:id", authMiddleware(["student"]), getHealthRecordById);
router.put("/:id", authMiddleware(["student"]), updateHealthRecord);
router.delete("/:id", authMiddleware(["student"]), deleteHealthRecord);

export default router;
