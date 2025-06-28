import { Appointment } from "../models/appointmentModel.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    const studentId = req.user.id;
    // Check if the student is booking a valid time slot
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked." });
    }

    const appointment = new Appointment({
      studentId,
      doctorId,
      date,
      timeSlot,
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
    const { studentId } = req.params;

    const appointments = await Appointment.find({ studentId }).populate(
      "doctorId",
      "name email"
    );

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctorId }).populate(
      "studentId",
      "name email"
    );

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "confirmed" or "cancelled" or "pending" for rescheduling purposes

    if (!["confirmed", "cancelled", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: `Appointment ${status} successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
