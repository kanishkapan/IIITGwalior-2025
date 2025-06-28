import { Appointment } from "../models/appointmentModel.js";

export const bookAppointment = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { doctorId, slotDateTime } = req.body;
    const studentId = req.user.id;
    
    // Check if the student is booking a valid time slot
    const existingAppointment = await Appointment.findOne({
      doctorId,
      slotDateTime
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked." });
    }

    const appointment = new Appointment({
      studentId,
      doctorId,
      slotDateTime
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentAppointments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status } = req.query;

    const filter = { studentId };
    if (status) {
      filter.status = status;
    }
    const appointments = await Appointment.find(filter).populate(
      "doctorId",
      "name email specialization"
    );

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

