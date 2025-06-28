import React, { useEffect, useState } from "react";
import { api } from "../../axios.config.js";
import { useNavigate } from "react-router-dom";

const Leave = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
    healthRecordId: "",
    supportingDocuments: null,
  });

  const [healthRecords, setHealthRecords] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/health-record");
        const sortedRecords = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setHealthRecords(sortedRecords);
      } catch (error) {
        console.error("Error fetching health records:", error);
      }
    };
    fetchHealthRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const formDataToSend = new FormData();

      // Append non-file data
      Object.keys(formData).forEach((key) => {
        if (key !== "supportingDocuments") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // ✅ Append multiple files
      if (formData.supportingDocuments) {
        Array.from(formData.supportingDocuments).forEach((file) => {
          formDataToSend.append("supportingDocuments", file);
        });
      }

      const response = await api.post("/leave/apply", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200||response.status === 201) {
        alert("Leave application submitted successfully.");
        navigate("/profile");
      }

      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <h2 className="text-3xl md:text-5xl font-bold text-green-600 mb-6 md:mb-8 text-center">
        Medical Leave Form
      </h2>
      <p className="text-gray-600 text-lg md:text-xl mb-4 md:mb-6 text-center">
        Apply for medical leave with ease!
      </p>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 w-full max-w-lg md:max-w-4xl flex flex-col gap-6">
        <form
          className="space-y-4 md:space-y-6 text-lg md:text-xl"
          onSubmit={handleSubmit}
        >
          <p className="text-red-500 font-semibold text-sm">* indicates required fields</p>

          <div>
            <label className="block text-gray-700 font-semibold">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              placeholder="Reason for leave"
              className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl h-24 md:h-32"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Health Record <span className="text-red-500">*</span>
            </label>
            <select
              name="healthRecordId"
              className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
              onChange={handleChange}
              value={formData.healthRecordId}
              required
            >
              <option value="">Select Health Record</option>
              {healthRecords.map((record) => (
                <option key={record._id} value={record._id}>
                  {record.diagnosis} -{" "}
                  {new Date(record.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(",", "")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Supporting Documents (if any)
            </label>
            <input
              type="file"
              name="supportingDocuments"
              multiple
              className="w-full border rounded-md p-3 md:p-4 text-gray-700 text-lg md:text-xl"
              onChange={(e) =>
                setFormData({ ...formData, supportingDocuments: e.target.files })
              }
            />
          </div>

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
