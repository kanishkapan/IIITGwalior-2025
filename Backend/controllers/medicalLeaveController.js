// medicalLeaveController.js
import { MedicalLeave } from "../models/medicalLeaveModel.js";
import { User } from "../models/index.js";
import { Notification } from "../models/notificationModel.js";

import { uploadMultipleDocuments } from "../utils/cloudinary.js";
import { HealthRecord } from "../models/healthRecordModel.js";
import fs from "fs";

// Apply for Medical Leave
export const applyMedicalLeave = async (req, res) => {
  try {
    // By this point, multer middleware has already processed the files
    // and made them available in req.files, and form fields in req.body
    const { fromDate, toDate, reason, healthRecordId } = req.body;
    
    // Process uploaded files
    let supportingDocuments = [];
    if (req.files && req.files.length > 0) {
      // Upload files to Cloudinary
      const filePaths = req.files.map(file => file.path);
      const uploadResults = await uploadMultipleDocuments(filePaths);
      
      // Format the document array for storage
      supportingDocuments = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format
      }));
      
      // Clean up temp files after upload
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.log(`Failed to delete temp file: ${file.path}`, err);
        });
      });
    }
    
    // Create the medical leave request with all form data
    const leaveRequest = await MedicalLeave.create({
      studentId: req.user.id,
      healthRecordId,
      fromDate,
      toDate,
      reason,
      supportingDocuments,
      status: "pending",
    });

    // Emit real-time notification to ALL online admins
    const io = req.app.get("socketio");
    const onlineUsers = req.app.get("onlineUsers");
    //save in mongo db
    const studentNotification = await Notification.create({
      recipientId: req.user.id, 
      type: "leave",
      message: "Your leave request has been submitted successfully.",
    });
    console.log("$$$$..Saved student noti");

    // Find all admins and notify them 
    onlineUsers.forEach(async(socket, userId) => {
      const user = await User.findById(userId);
      if (user && user.role =="admin") {
        console.log("Informing admin about the leave application");

        //storing in mongo db 
        await Notification.create({
          recipientId: user._id,  // Store admin ID
          type: "leave",
          message: "A student has applied for medical leave!",
        });

        socket.emit("newLeaveRequest", {
          message: "A student has applied for medical leave!",
          leaveRequest,
        });
      }
    });

    res.status(201).json({ 
      message: "Medical leave applied", 
      leaveRequest 
    });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getAllLeaveApplications = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming req.user contains logged-in student info

    const leaveApplications = await MedicalLeave.find({ studentId })
      .populate("studentId", "name email")
      .populate({
        path: "healthRecordId",
        select: "diagnosis date doctorId isManualUpload externalDoctorName attachments",
        populate: {
          path: "doctorId",
          select: "name"
        }
      });

    const formattedApplications = leaveApplications.map((application) => ({
      id: application._id,
      reason: application.reason,
      fromDate: application.fromDate.toISOString().split("T")[0],
      toDate: application.toDate.toISOString().split("T")[0],
      diagnosis: application.healthRecordId?.diagnosis || "N/A",
      date: application.healthRecordId?.date?.toISOString().split("T")[0] || "N/A",
      doctorName: application.healthRecordId?.isManualUpload
        ? application.healthRecordId.externalDoctorName || "N/A"
        : application.healthRecordId?.doctorId?.name || "N/A",
        status: application.status
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Leave Status for Student
export const getLeaveStatus = async (req, res) => {
  try {
    const leaveRequests = await MedicalLeave.find({ studentId: req.user.id }).populate("healthRecordId");
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};