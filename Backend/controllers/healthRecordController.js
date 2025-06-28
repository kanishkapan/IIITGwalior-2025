import { HealthRecord, User } from '../models/index.js';
import encryptionService from '../services/encryptionService.js';
import blockchainService from '../services/blockchainService.js';
import ipfsService from '../services/ipfsService.js';

// Create encrypted health record
export const createHealthRecord = async (req, res) => {
  try {
    console.log('=== HEALTH RECORD CREATION DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const { 
      doctorId, 
      diagnosis, 
      treatment, 
      prescription, 
      date,
      isManualUpload,
      externalDoctorName,
      externalHospitalName 
    } = req.body;
    
    // Get studentId from the logged-in user (not from request body)
    const studentId = req.user.id;
    
    console.log('Student ID (from token):', studentId);
    console.log('Doctor ID (from form):', doctorId);
    console.log('Is manual upload:', isManualUpload);
    
    // Verify the logged-in user is a student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ 
        message: 'Student not found',
        studentId: studentId
      });
    }
    
    if (student.role !== 'student') {
      return res.status(403).json({ 
        message: 'Only students can create health records',
        userRole: student.role
      });
    }
    
    console.log('Found student:', student.name);
    
    let doctor = null;
    
    // Handle internal vs external doctor
    if (!isManualUpload || isManualUpload === 'false') {
      // Internal doctor - verify doctor exists
      if (!doctorId) {
        return res.status(400).json({ message: 'Doctor ID is required for internal records' });
      }
      
      doctor = await User.findById(doctorId);
      if (!doctor || doctor.role !== 'doctor') {
        return res.status(404).json({ 
          message: 'Doctor not found',
          doctorId: doctorId
        });
      }
      console.log('Found doctor:', doctor.name);
    } else {
      // External/manual upload - validate external doctor info
      if (!externalDoctorName || !externalHospitalName) {
        return res.status(400).json({ 
          message: 'External doctor name and hospital name are required for manual uploads' 
        });
      }
      console.log('External doctor:', externalDoctorName, 'at', externalHospitalName);
    }
    
    // Create health record
    const healthRecordData = {
      studentId,
      diagnosis,
      treatment,
      prescription,
      date: date ? new Date(date) : new Date(),
      isManualUpload: isManualUpload === 'true' || isManualUpload === true
    };
    
    // Add doctor info based on type
    if (healthRecordData.isManualUpload) {
      healthRecordData.externalDoctorName = externalDoctorName;
      healthRecordData.externalHospitalName = externalHospitalName;
    } else {
      healthRecordData.doctorId = doctorId;
    }
    
    const healthRecord = new HealthRecord(healthRecordData);
    await healthRecord.save();
    
    console.log('Health record created:', healthRecord._id);
    
    res.status(201).json({
      message: "Health record created successfully",
      recordId: healthRecord._id,
      student: student.name,
      doctor: doctor ? doctor.name : externalDoctorName
    });
    
  } catch (error) {
    console.error("Error creating health record:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
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




export const getHealthRecordsadmin = async (req, res) => {
  try {
    // Fetch all health records and populate student and doctor details
    const healthRecords = await HealthRecord.find()
      .populate("studentId", "name gender email phone dateOfBirth") // Populate student details
      .populate("doctorId", "name specialization email phone"); // Populate doctor details

    // Format the records for the frontend
    const formattedRecords = healthRecords.map((record) => ({
      id: record._id,
      studentName: record.studentId?.name || "Unknown",
      studentId: record.studentId?._id || null,
      gender: record.studentId?.gender || "Unknown",
      diagnosis: record.diagnosis,
      date: record.date.toISOString().split("T")[0],
      prescription: record.prescription || "No prescription provided",
      attachments: record.attachments.map(att => ({
        url: att.url || null,
        format: att.url ? att.url.split('.').pop().toLowerCase() : null,
      })),
      doctorName: record.isManualUpload
        ? record.externalDoctorName
        : record.doctorId?.name || "Unknown",
      hospitalName: record.isManualUpload ? record.externalHospitalName : null,
    }));
    console.log("Formatted records:", formattedRecords);
    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ message: error.message });
  }
};


//Search



export const searchHealthRecords = async (req, res) => {
  try {
    const { query } = req.query;
    const studentId = req.user.id;
    console.log("Search query:", query);
    console.log("Student ID:", studentId);

    const records = await HealthRecord.find({
      studentId,
      $or: [
        { diagnosis: { $regex: query, $options: "i" } },
        { treatment: { $regex: query, $options: "i" } },
        { prescription: { $regex: query, $options: "i" } },
        { externalDoctorName: { $regex: query, $options: "i" } },
        { externalHospitalName: { $regex: query, $options: "i" } },
      ],
    });

    console.log("Records found:", records.length);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error searching health records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query; // User's input
    const studentId = req.user.id; // Authenticated user ID

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Fetch suggestions based on partial matches
    const suggestions = await HealthRecord.find({
      studentId,
      $or: [
        { diagnosis: { $regex: query, $options: "i" } },
        { treatment: { $regex: query, $options: "i" } },
        { prescription: { $regex: query, $options: "i" } },
        { externalDoctorName: { $regex: query, $options: "i" } },
        { externalHospitalName: { $regex: query, $options: "i" } },
      ],
    }).limit(5); // Limit the number of suggestions

    // Extract unique suggestions (e.g., diagnosis names)
    const uniqueSuggestions = [...new Set(suggestions.map(s => s.diagnosis))];

    res.status(200).json(uniqueSuggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};