import { HealthRecord } from "../models/healthRecordModel.js";

// Create a new health record
export const createHealthRecord = async (req, res) => {
  try {
    const { doctorId, diagnosis, treatment, prescription, isManualUpload, externalDoctorName, externalHospitalName, attachments } = req.body;
    const studentId = req.user.id;
    // const doctorId = isManualUpload ? null : req.body; // If manually uploaded, no doctorId

    const newRecord = new HealthRecord({
      studentId,
      doctorId,
      diagnosis,
      treatment,
      prescription,
      isManualUpload,
      externalDoctorName,
      externalHospitalName,
      attachments,
    });

    await newRecord.save();
    res.status(201).json({ message: "Health record created successfully", newRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating health record", error: error.message });
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
