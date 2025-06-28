import {
  Appointment,
  HealthRecord,
  MedicalLeave,
  User,
} from "../models/index.js";

export const updateTimeSlots = async (req, res) => {
  const doctorId = req.user.id;
  const newSlots = req.body.slots;
  try {
    // Update the doctor's available slots in the User model
    // Using proper MongoDB syntax for updating array fields
    await User.findByIdAndUpdate(
      doctorId,
      { $push: { availableSlots: { $each: newSlots } } },
      { new: true }
    );
    return res.status(200).json({ message: "Time slots updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    const { doctorId, slotDateTime } = appointment;

    // Handle slot booking status based on appointment status
    if (status === "confirmed") {
      // Mark slot as booked when appointment is confirmed
      const updatedDoctor = await User.findOneAndUpdate(
        {
          _id: doctorId,
          "availableSlots.dateTime": slotDateTime,
        },
        {
          $set: {
            "availableSlots.$.isBooked": true,
          },
        },
        { new: true }
      );

      if (!updatedDoctor) {
        console.log("Could not find matching slot for doctor when confirming");
      }
    } else if (status === "cancelled") {
      // Mark slot as available again when appointment is cancelled
      const updatedDoctor = await User.findOneAndUpdate(
        {
          _id: doctorId,
          "availableSlots.dateTime": slotDateTime,
        },
        {
          $set: {
            "availableSlots.$.isBooked": false,
          },
        },
        { new: true }
      );

      if (!updatedDoctor) {
        console.log("Could not find matching slot for doctor when cancelling");
      }
    }

    res.status(200).json({ message: `Appointment ${status} successfully.` });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { status } = req.query;

    const filter = { doctorId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter).populate(
      "studentId",
      "name email"
    );

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
