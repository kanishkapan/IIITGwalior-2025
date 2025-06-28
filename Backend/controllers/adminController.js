import { MedicalLeave } from "../models/medicalLeaveModel.js";
import { User } from "../models/userModel.js";
import { HealthRecord } from "../models/healthRecordModel.js";
import{Notification} from "../models/notificationModel.js"

export const getMedicalLeaveApplications = async (req, res) => {
    try {
      const leaves = await MedicalLeave.find()
      .populate("studentId", "name gender email phone dateOfBirth") // Populate student details
      .populate("healthRecordId", "diagnosis treatment prescription date doctorId isManualUpload externalDoctorName externalHospitalName attachments") // Populate health record details
      .populate("approvedBy", "name email"); // Select only these fields
  
      const formattedLeaves = leaves.map((leave) => ({
        id: leave._id,
        studentName: leave.studentId.name,
        studentId: leave.studentId._id,
        gender: leave.studentId.gender,
        duration: `${leave.fromDate.toISOString().split("T")[0]} to ${leave.toDate.toISOString().split("T")[0]}`,
        diagnosis: leave.healthRecordId?.diagnosis,
        status: leave.status,
      }));
  
      res.status(200).json(formattedLeaves);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

export const updateLeaveStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'approved' or 'rejected'
  
      if (!["approved", "rejected"].includes(status)) {
        console.log("invalid status recieved ")
        return res.status(400).json({ message: "Invalid status" });
      }
      console.log("Admin User:", req.user);
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: Admin ID missing" });
      }

      const leave = await MedicalLeave.findByIdAndUpdate(
        id,
        { status, approvedBy: req.user.id }, // Assuming `req.user.id` contains admin ID
        { new: true }
      );
  
      if (!leave) {
        return res.status(404).json({ message: "Medical leave not found" });
        console.log("leave not found");
      }
      console.log("request updated");
      //store in mongodb
      const notification = await Notification.create({
        recipientId: leave.studentId,
        type: "leave",
        message: `Your leave request has been ${status}.`,
      });
      console.log("stored in db");
      const io = req.app.get("socketio"); // Get Socket.io instance
      const studentSocket = req.app.get("onlineUsers").get(leave.studentId.toString());

      if (studentSocket) {
        console.log("informing patient about the leave application status");
        // studentSocket.emit("leaveStatusUpdate", { message:notification.message,leave });
        studentSocket.emit("newNotification", {
          notification, leave,
        });
  

      }
      else {
        console.log(`Student ${leave.studentId} is offline.`);
      }

  
      res.status(200).json({ message: `Leave ${status} successfully`, leave });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  export const viewLeaveDetails = async (req, res) => {
    try {
      
        const { id } = req.params;
    
        const leave = await MedicalLeave.findById(id)
        .populate({
          path: "studentId",
          select: "name gender email phone dateOfBirth"
        })
        .populate({
          path: "healthRecordId",
          select: "diagnosis treatment prescription date doctorId isManualUpload externalDoctorName externalHospitalName attachments",
          populate: {
            path: "doctorId",
            select: "name "
          }
        })
        .populate("approvedBy", "name email");
    
        if (!leave) {
          return res.status(404).json({ message: "Medical leave not found" });
        }
    
        const detailedLeave = {
          id: leave._id,
          studentName: leave.studentId.name,
          studentId: leave.studentId._id,
          gender: leave.studentId.gender,
          email: leave.studentId.email,
          phone: leave.studentId.phone,
          dateOfBirth: leave.studentId.dateOfBirth?.toISOString().split("T")[0] || null,
          duration: `${leave.fromDate.toISOString().split("T")[0]} to ${leave.toDate.toISOString().split("T")[0]}`,
          reason: leave.reason,
          status: leave.status,
          diagnosis: leave.healthRecordId?.diagnosis || null,
          treatment: leave.healthRecordId?.treatment || null,
          prescription: leave.healthRecordId?.prescription || null,
          doctorName: leave.healthRecordId?.isManualUpload
            ? leave.healthRecordId.externalDoctorName
            : leave.healthRecordId?.doctorId?.name || null,
          hospitalName: leave.healthRecordId?.isManualUpload
            ? leave.healthRecordId.externalHospitalName
            : null,
          //attachments: leave.healthRecordId?.attachments || [],
          supportingDocuments: leave.supportingDocuments || [],
          approvedBy: leave.approvedBy ? { name: leave.approvedBy.name, email: leave.approvedBy.email } : null,
        };
        //console.log("Attachments:", leave.healthRecordId?.attachments);
        console.log("Attachments:", leave.supportingDocuments);
        console.log(leave.healthRecordId?.doctorId?.externalDoctorName);
        console.log(leave.healthRecordId?.doctorId?.name);
        res.status(200).json(detailedLeave);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
