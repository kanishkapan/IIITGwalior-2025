import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js"; // Import API instance

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    slotId: "", // Changed from timeSlot to slotId
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch available doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/user/doctors");
        setDoctors(response.data);
      } catch (error) {
        setError("Failed to load doctors. Please try again.");
        console.error("Error fetching doctors:", error.response?.data || error.message);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setAvailableSlots([]);
      setFormData((prev) => ({ ...prev, slotId: "" }));
      if (!formData.doctorId || !formData.date) return;
      setLoading(true);
      setError("");
      try {
        const response = await api.get(
          `/user/doctor/${formData.doctorId}/available-slots?date=${formData.date}`
        );
        setAvailableSlots(response.data);
        if (response.data.length === 0) {
          setError("No available slots for this date. Please try another date.");
        }
      } catch (error) {
        setError("Failed to load available time slots. Please try again.");
        console.error("Error fetching slots:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSlots();
  }, [formData.doctorId, formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const selectedSlot = availableSlots.find((slot) => slot.id === formData.slotId);
      if (!selectedSlot) {
        throw new Error("Selected time slot not found. Please try again.");
      }
      const dateStr = formData.date;
      const timeStr = selectedSlot.time;
      let time24h = timeStr;
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const [hourMin, period] = timeStr.split(" ");
        let [hours, minutes] = hourMin.split(":").map(Number);
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        time24h = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }
      const slotDateTime = new Date(`${dateStr}T${time24h}:00`);
      const appointmentData = {
        doctorId: formData.doctorId,
        slotDateTime: slotDateTime.toISOString(),
      };
      const response = await api.post("/appointment", appointmentData);
      setSuccess("Appointment booked successfully!");
      setFormData({ doctorId: "", date: "", slotId: "" });
      setAvailableSlots([]);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const today = formatDate(new Date());

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8 lg:p-12">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 w-full max-w-lg md:max-w-2xl lg:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-green-600 text-center">Book Your Appointment</h2>
        <p className="text-gray-600 text-center mt-2">Schedule your appointment easily with our doctors.</p>
        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 my-4">{success}</div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 my-4">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Select Doctor</label>
            <select name="doctorId" className="w-full border rounded-md p-2" onChange={handleChange} value={formData.doctorId} required>
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Select Date</label>
            <input type="date" name="date" min={today} className="w-full border rounded-md p-2" onChange={handleChange} value={formData.date} required />
          </div>
          <div>
            <label className="block text-gray-700">Select Time Slot</label>
            <select name="slotId" className="w-full border rounded-md p-2" onChange={handleChange} value={formData.slotId} required>
              <option value="">Select Time Slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.time}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400" disabled={!formData.slotId}>{loading ? "Processing..." : "Book Appointment"}</button>
        </form>
      </div>
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img src="../src/assets/patientform.png" alt="Doctor Consultation" className="w-full max-w-md rounded-lg" />
      </div>
    </div>
  );
};

export default AppointmentForm;
