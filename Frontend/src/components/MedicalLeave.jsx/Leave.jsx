import React, { useState } from "react";

const Leave = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
    healthRecordId: "",
    supportingDocuments: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const response = await fetch("https://your-backend-api.com/apply-medical-leave", {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <h2 className="text-3xl md:text-5xl font-bold text-green-600 mb-6 md:mb-8 text-center">Medical Leave Form</h2>
      <p className="text-gray-600 text-lg md:text-xl mb-4 md:mb-6 text-center">
        Apply for medical leave with ease!
      </p>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 w-full max-w-lg md:max-w-4xl flex flex-col gap-6">
        <form className="space-y-4 md:space-y-6 text-lg md:text-xl" onSubmit={handleSubmit}>
          <input
            type="date"
            name="fromDate"
            className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
            onChange={handleChange}
          />
          <input
            type="date"
            name="toDate"
            className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
            onChange={handleChange}
          />
          <textarea
            name="reason"
            placeholder="Reason for leave"
            className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl h-24 md:h-32"
            onChange={handleChange}
          ></textarea>
          <input
            type="text"
            name="healthRecordId"
            placeholder="Health Record ID"
            className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
            onChange={handleChange}
          />
          <input
            type="file"
            name="supportingDocuments"
            className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
            onChange={(e) => setFormData({ ...formData, supportingDocuments: e.target.files[0] })}
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 md:py-4 rounded-md text-lg md:text-xl font-semibold hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Leave;