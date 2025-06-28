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
      // Clear previous slots
      setAvailableSlots([]);
      setFormData(prev => ({ ...prev, slotId: "" }));
      
      // Only fetch if both doctor and date are selected
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
    setSuccess(""); // Clear success message on form change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Find the selected slot's full dateTime
      const selectedSlot = availableSlots.find(slot => slot.id === formData.slotId);
      
      // Prepare the data for submission
      const appointmentData = {
        doctorId: formData.doctorId,
        slotDateTime: selectedSlot.dateTime // Using the full dateTime from the slot
      };
      
      const response = await api.post("/appointment", appointmentData);
      setSuccess("Appointment booked successfully!");
      console.log("Response from server:", response.data);
      
      // Reset form after successful submission
      setFormData({
        doctorId: "",
        date: "",
        slotId: ""
      });
      setAvailableSlots([]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to book appointment. Please try again.");
      console.error("Error submitting form:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    // Format a date as YYYY-MM-DD for the input field
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Get current date for min date attribute
  const today = formatDate(new Date());

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Left Section - Form */}
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg lg:w-1/2">
        <h2 className="text-4xl font-bold text-green-600 mb-4">Book Your Appointment</h2>
        <p className="text-gray-600 mb-6">Schedule your appointment easily with our doctors.</p>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{success}</p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Form Fields */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Doctor Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Select Doctor</label>
            <select
              name="doctorId"
              className="w-full border rounded-md p-3 text-gray-700"
              onChange={handleChange}
              value={formData.doctorId}
              required
              disabled={loading}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              name="date"
              min={today}
              className="w-full border rounded-md p-3 text-gray-700"
              onChange={handleChange}
              value={formData.date}
              required
              disabled={loading}
            />
          </div>
          
          {/* Time Slot Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Select Time Slot</label>
            <select
              name="slotId"
              className="w-full border rounded-md p-3 text-gray-700"
              onChange={handleChange}
              value={formData.slotId}
              required
              disabled={loading || availableSlots.length === 0}
            >
              <option value="">Select Time Slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.time}
                </option>
              ))}
            </select>
            {loading && formData.doctorId && formData.date && (
              <p className="text-gray-500 mt-2">Loading available slots...</p>
            )}
            {!loading && availableSlots.length === 0 && formData.doctorId && formData.date && (
              <p className="text-red-500 mt-2">No available slots for this date</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400"
            disabled={loading || !formData.slotId}
          >
            {loading ? "Processing..." : "Book Appointment"}
          </button>
        </form>
      </div>
      
      {/* Right Section - Image */}
      <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 p-6">
        <img
          src="/path-to-your-image.png" // Replace with actual image path
          alt="Doctor Consultation"
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AppointmentForm;