import React, { useState } from "react";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    mode: "offline",
    date: "",
    contact: "",
    symptoms: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModeChange = (mode) => {
    setFormData({ ...formData, mode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("https://your-backend-api.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Left Section - Form */}
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg lg:w-1/2">
        <h2 className="text-4xl font-bold text-green-600 mb-4">Book Your Spot</h2>
        <p className="text-gray-600 mb-6">Connect with Us: Let's Connect to your Favourite Doctor</p>
        
        {/* Mode Selection */}
        <div className="flex gap-6 mb-6 text-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="offline"
              checked={formData.mode === "offline"}
              onChange={() => handleModeChange("offline")}
              className="accent-green-500"
            />
            Offline
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="online"
              checked={formData.mode === "online"}
              onChange={() => handleModeChange("online")}
              className="accent-green-500"
            />
            Online
          </label>
        </div>

        {/* Form Fields */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="date"
            placeholder="When are you free?"
            className="w-full border rounded-md p-3 text-gray-700"
            onChange={handleChange}
          />
          <input
            type="text"
            name="contact"
            placeholder="Get a Close One"
            className="w-full border rounded-md p-3 text-gray-700"
            onChange={handleChange}
          />
          <textarea
            name="symptoms"
            placeholder="Symptoms"
            className="w-full border rounded-md p-3 text-gray-700 h-32"
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800"
          >
            Book Appointment
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
