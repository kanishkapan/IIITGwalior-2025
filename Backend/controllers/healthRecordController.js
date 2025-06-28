import { HealthRecord } from "../models/healthRecordModel.js";
import { uploadMultipleDocuments } from "../utils/cloudinary.js";
import fs from 'fs';

// Create a new health record
export const createHealthRecord = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { diagnosis, treatment, prescription, externalDoctorName, externalHospitalName } = req.body;
    const studentId = req.user.id;
    const isManualUpload = req.body.isManualUpload === "true"; // Get student ID from authenticated user
    let doctorId;

    if (isManualUpload) {
      doctorId = null;
    } else if (!req.body.doctorId || req.body.doctorId === "") {
      return res.status(400).json({ message: "Doctor ID is required" });
    } else {
      doctorId = req.body.doctorId;
    }

    if (!diagnosis || !treatment) {
      return res.status(400).json({ message: "Diagnosis and treatment are required" });
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      // Upload files to Cloudinary
      const filePaths = req.files.map(file => file.path);
      const uploadResults = await uploadMultipleDocuments(filePaths);
      
      // Format the document array for storage
      attachments = uploadResults.map(result => ({
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

    const newRecord = new HealthRecord({
      studentId,
      doctorId,
      diagnosis,
      treatment,
      prescription,
      isManualUpload,
      externalDoctorName,
      externalHospitalName,
      attachments, // Handle file uploads
    });

    await newRecord.save();
    res.status(201).json({ message: "Health record created successfully", newRecord });
  } catch (error) {
    console.error("Error creating health record:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all health records for the logged-in student
export const getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ studentId: req.user.id });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health records", error });
  }
};

// Get a single health record by ID
export const getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Health record not found" });
    
    if (record.studentId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health record", error });
  }
};

// Update a health record
export const updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Health record not found" });

    if (record.studentId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(record, req.body);
    await record.save();
    res.status(200).json({ message: "Health record updated successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Error updating health record", error });
  }
};

// Delete a health record
export const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Health record not found" });

    if (record.studentId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await record.deleteOne();
    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting health record", error });
  }
};
