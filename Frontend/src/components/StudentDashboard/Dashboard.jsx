import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js"; // Axios instance
import { Link } from "react-router-dom";
import {
  Bell,
  Settings,
  Search,
  Upload,
  Calendar,
  FileText,
  MessageCircle,
} from "lucide-react";
import Notibell from "../Noti/Notibell.jsx";
import socket from "../../socket.js";


const Dashboard = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [leaveError, setLeaveError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  // New states for search suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await api.get("/leave/");
        if (Array.isArray(response.data)) {
          setLeaveApplications(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setLeaveApplications([]);
        }
      } catch (err) {
        console.error("Error fetching leave applications:", err);
        setLeaveError("Failed to load leave applications.");
      } finally {
        setLeaveLoading(false);
      }
    };

    fetchLeaveApplications();
    

  }, []);

  // Fetch health records
  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/health-record");
        if (Array.isArray(response.data)) {
          setHealthRecords(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setHealthRecords([]);
        }
      } catch (err) {
        console.error("Error fetching health records:", err);
        setError("Failed to load health records.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  
  
  // Fetch student appointments
  useEffect(() => {
    const fetchStudentAppointments = async () => {
      try {
        const response = await api.get("/appointment/student");
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
        } else {
          console.error(
            "Unexpected appointment response format:",
            response.data
          );
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching student appointments:", err);
        setAppointmentsError("Failed to load student appointments.");
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchStudentAppointments();


    socket.on("appointmentUpdate", (data) => {
      console.log("🔔 Real-time appointment update received:", data);
      showAlert(data.message, 'custom', 10000);
      fetchStudentAppointments();
      
    });
    
    socket.on("newAppointment", (data) => {
      console.log(" 📥New appointment received:", data);
      console.log('recieved at',new Date().toLocaleTimeString());
      showAlert(data.message, "custom", 10000);
      setNotificationCount(prev => prev + 1);
      const updatedAppointment = { 
        ...data.appointment,
        doctorId: {
          ...(data.appointment.doctorId || {}),
          name: data.appointment.doctorName || data.appointment.doctorId?.name || "Unknown"
        }
      };
      console.log("calling set apptment")
      setAppointments((prev) => [updatedAppointment, ...prev]);
    });
  
    // ✅ Clean up on component unmount
    return () => {
      socket.off("appointmentUpdate");
      socket.off("newAppointment");
    };

  }, []);

    // Debounced API call for search suggestions
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (searchQuery) {
          api
            .get("/user/searchSuggestions", { params: { query: searchQuery } })
            .then((res) => {
              setSuggestions(res.data);
            })
            .catch((err) => {
              console.error("Error fetching suggestions:", err);
              setSuggestions([]);
            });
        } else {
          setSuggestions([]);
        }
      }, 300);
  
      return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    // When a search suggestion is clicked, use it as a query to search health records
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    api
      .get("/user/search", { params: { query: suggestion } })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setSearchResults([]);
      });
  };

  const viewHealthRecordDetails = async (id) => {
    try {
      const response = await api.get(`/health-record/${id}`);
      setSelectedRecord(response.data); // Update state with selected record details
    } catch (err) {
      console.error("Error fetching health record details:", err);
      alert("Failed to load health record details.");
    }
  };

  const deleteHealthRecord = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this record?"
      );
      if (!confirmDelete) return;

      await api.delete(`/health-record/${id}/delete`);
      alert("Health record deleted successfully.");
      setHealthRecords(healthRecords.filter((record) => record._id !== id));
    } catch (err) {
      console.error("Error deleting health record:", err);
      alert("Failed to delete health record.");
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get the next upcoming appointment (for the action button history)
  // Update the getNextAppointment function:
  // Update the getNextAppointment function:
  const getNextAppointment = () => {
    if (appointments.length === 0) return "No upcoming appointments";

    // Sort based on slotDateTime instead of date
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime)
    );

    const now = new Date();
    const upcomingAppointment = sortedAppointments.find(
      (apt) => new Date(apt.slotDateTime) > now
    );

    if (upcomingAppointment) {
      return `Next appointment: ${formatDate(
        upcomingAppointment.slotDateTime
      )} - ${upcomingAppointment.doctorId?.name || "Doctor"}`;
    } else {
      return "No upcoming appointments";
    }
  };

  {
    /* Student Appointments Section */
  }
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">
      My Appointments
    </h2>
    {appointmentsLoading ? (
      <p>Loading appointments...</p>
    ) : appointmentsError ? (
      <p>{appointmentsError}</p>
    ) : appointments.length > 0 ? (
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Doctor</th>
            <th className="px-4 py-2 border-b text-left">Date & Time</th>
            <th className="px-4 py-2 border-b text-left">Status</th>
            <th className="px-4 py-2 border-b text-left">Prescription</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id || appointment.id}>
              <td className="px-4 py-2 border-b">
                {appointment.doctorId?.name || "Not specified"}
              </td>
              <td className="px-4 py-2 border-b">
                {formatDate(appointment.slotDateTime)}
              </td>
              <td className="px-4 py-2 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    appointment.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : appointment.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {appointment.status || "N/A"}
                </span>
              </td>
              <td className="px-4 py-2 border-b">
                {appointment.prescription ? (
                  <a
                    href={appointment.prescription}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Prescription
                  </a>
                ) : (
                  "No prescription"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No appointments found.</p>
    )}
  </div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r">
        <h2 className="text-xl font-bold text-green-600 mb-6">
          Student Dashboard
        </h2>
        
        <nav className="space-y-2">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Appointments", path: "/appointment" },
            { name: "Health Records", path: "/recordform" },
            { name: "Certificate Generator", path: "/certificate" }, // Custom path
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span className="ml-2 text-lg font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* New AI Feature Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-green-600 mb-4">AI Features</h3>
          <nav className="space-y-2">
            {["Leave Concern", "Health Record Concern", "AI Diagnosis"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <span className="ml-2 text-lg font-medium">{item}</span>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {/* Dropdown for suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute bg-white border rounded-lg mt-1 w-full z-10">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Notibell count={notificationCount} setCount={setNotificationCount} className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Action Buttons & History */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[
            {
              title: "Health Records",
              action: "Upload Health Record",
              color: "bg-blue-600",
              icon: Upload,
              history: "Last uploaded: Blood Test Report - 10th March 2025",
              route: "/recordform",
            },
            {
              title: "Leave Applications",
              action: "Apply for Leave",
              color: "bg-green-600",
              icon: FileText,
              history: "Last leave applied: 5th March 2025 (Medical Leave)",
              route: "/leave",
            },
            {
              title: "Appointments",
              action: "Book Appointment",
              color: "bg-purple-600",
              icon: Calendar,
              history: getNextAppointment(),
              route: "/appointment",
            },
            {
              title: "AI Diagnosis",
              action: "AI DIAGNOSIS",
              color: "bg-yellow-500",
              icon: MessageCircle,
              history: "Last query: 'Best home remedies for fever?'",
              route: "/ai-diagnosis",
            },
          ].map((item, index) => (
            <Link to={item.route} key={index} className="block">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  {item.title}
                </h2>
                <button
                  className={`flex items-center justify-center ${item.color} text-white p-4 rounded-xl shadow-md w-full mb-4 text-lg font-semibold`}
                >
                  <item.icon className="mr-2" /> {item.action}
                </button>
                <p className="text-gray-800 text-lg font-medium bg-gray-100 p-4 rounded-lg shadow-sm">
                  {item.history}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Medical Leave Applications Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Medical Leave Applications
          </h2>

          {leaveLoading ? (
            <p>Loading leave applications...</p>
          ) : leaveError ? (
            <p>{leaveError}</p>
          ) : leaveApplications.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Sno.</th>
                  <th className="px-4 py-2 border-b text-left">Date</th>
                  <th className="px-4 py-2 border-b text-left">From Date</th>
                  <th className="px-4 py-2 border-b text-left">To Date</th>
                  <th className="px-4 py-2 border-b text-left">Diagnosis</th>
                  <th className="px-4 py-2 border-b text-left">Status</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaveApplications.map((leave, index) => (
                  <tr key={leave.id}>
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{leave.date}</td>
                    <td className="px-4 py-2 border-b">{leave.fromDate}</td>
                    <td className="px-4 py-2 border-b">{leave.toDate}</td>
                    <td className="px-4 py-2 border-b">{leave.diagnosis}</td>

                    {/* Status Highlighting */}
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : leave.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {leave.status && typeof leave.status === "string"
                          ? leave.status.charAt(0).toUpperCase() +
                            leave.status.slice(1)
                          : "N/A"}
                      </span>
                    </td>

                    {/* View Status Button */}
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="text-blue-600 hover:underline"
                      >
                        View Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medical leave applications found.</p>
          )}

          {/* Modal for viewing selected leave details */}
          {selectedLeave && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Medical leave applications
              </h2>

              <p>
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
              <p>
                <strong>Duration:</strong> {selectedLeave.fromDate} to{" "}
                {selectedLeave.toDate}
              </p>
              <p>
                <strong>Diagnosis:</strong> {selectedLeave.diagnosis}
              </p>
              <p>
                <strong>Doctor name:</strong> {selectedLeave.doctorName}
              </p>

              {/* Status with color highlighting */}
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedLeave.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedLeave.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedLeave.status.charAt(0).toUpperCase() +
                    selectedLeave.status.slice(1)}
                </span>
              </p>

              {/* Close Button */}
              <button
                onClick={() => setSelectedLeave(null)}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Student Appointments Section */}
        {/* Student Appointments Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            My Appointments
          </h2>
          {appointmentsLoading ? (
            <p>Loading appointments...</p>
          ) : appointmentsError ? (
            <p>{appointmentsError}</p>
          ) : appointments.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Doctor</th>
                  <th className="px-4 py-2 border-b text-left">Date & Time</th>
                  <th className="px-4 py-2 border-b text-left">Status</th>
                  <th className="px-4 py-2 border-b text-left">Prescription</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id || appointment.id}>
                    <td className="px-4 py-2 border-b">
                      {appointment.doctorId?.name || "Not specified"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {formatDate(appointment.slotDateTime)}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      {appointment.prescription ? (
                        <a
                          href={appointment.prescription}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Prescription
                        </a>
                      ) : (
                        "No prescription"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No appointments found.</p>
          )}
        </div>

        {/* Health Records Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Health Records
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : healthRecords.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Sno.</th>
                  <th className="px-4 py-2 border-b text-left">Diagnosis</th>
                  <th className="px-4 py-2 border-b text-left">Date</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map((record, index) => (
                  <tr key={record._id}>
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{record.diagnosis}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => viewHealthRecordDetails(record._id)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteHealthRecord(record._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No health records found.</p>
          )}
        </div>

        {/* Display Selected Record Details */}
        {selectedRecord && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Health Record Details
            </h2>

            <p>
              <strong>Diagnosis:</strong> {selectedRecord.diagnosis}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedRecord.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Treatment:</strong> {selectedRecord.treatment || "N/A"}
            </p>
            <p>
              <strong>Prescription:</strong>{" "}
              {selectedRecord.prescription || "N/A"}
            </p>
            <button
              onClick={() => setSelectedRecord(null)}
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
          
        )}
        {/* Modal for displaying search results */}
        {searchResults.length > 0 && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                Search Results
              </h3>
              {searchResults.map((record) => (
                <div key={record._id} className="mb-4 border-b pb-2">
                  <p>
                    <strong>Diagnosis:</strong> {record.diagnosis}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {record.treatment || "N/A"}
                  </p>
                  <p>
                    <strong>Prescription:</strong>{" "}
                    {record.prescription || "N/A"}
                  </p>
                </div>
              ))}
              <button
                onClick={() => setSearchResults([])}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
