import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js"; // Axios instance
import { Link } from 'react-router-dom';
import { Bell, Settings, Search, Upload, Calendar, FileText, MessageCircle } from "lucide-react";

const Dashboard = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

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
        const response = await api.get("/api/v1/appointment/student?status=pending");
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
        } else {
          console.error("Unexpected appointment response format:", response.data);
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
  }, []);

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
      const confirmDelete = window.confirm("Are you sure you want to delete this record?");
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get the next upcoming appointment (for the action button history)
  const getNextAppointment = () => {
    if (appointments.length === 0) return "No upcoming appointments";
    
    const sortedAppointments = [...appointments].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    const now = new Date();
    const upcomingAppointment = sortedAppointments.find(apt => 
      new Date(apt.date) > now
    );
    
    if (upcomingAppointment) {
      return `Next appointment: ${formatDate(upcomingAppointment.date)} - ${upcomingAppointment.doctorName || 'Doctor'}`;
    } else {
      return "No upcoming appointments";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r">
        <h2 className="text-xl font-bold text-blue-600 mb-6">MediSense</h2>
        <nav className="space-y-2">
          {["Dashboard", "Appointments", "Doctors",  "Certificates"].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
              <span className="ml-2 text-lg font-medium">{item}</span>
            </Link>
          ))}
        </nav>

        {/* New AI Feature Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-blue-600 mb-4">AI Feature</h3>
          <nav className="space-y-2">
            {["Leave Concern", "Health Record Concern", "AI Diagnosis"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
              >
                <span className="ml-2 text-lg font-medium">{item}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-gray-400" />
            <Bell className="w-6 h-6 text-gray-400" />
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Action Buttons & History */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[
            { title: "Health Records", action: "Upload Health Record", color: "bg-blue-600", icon: Upload, history: "Last uploaded: Blood Test Report - 10th March 2025", route: "/recordform" },
            { title: "Leave Applications", action: "Apply for Leave", color: "bg-green-600", icon: FileText, history: "Last leave applied: 5th March 2025 (Medical Leave)", route: "/leave" },
            { title: "Appointments", action: "Book Appointment", color: "bg-purple-600", icon: Calendar, history: getNextAppointment(), route: "/appointment" },
            { title: "AI Diagnosis", action: "AI DIAGNOSIS", color: "bg-yellow-500", icon: MessageCircle, history: "Last query: 'Best home remedies for fever?'", route: "/ai-diagnosis" },
          ].map((item, index) => (
            <Link to={item.route} key={index} className="block">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">{item.title}</h2>
                <button className={`flex items-center justify-center ${item.color} text-white p-4 rounded-xl shadow-md w-full mb-4 text-lg font-semibold`}>
                  <item.icon className="mr-2" /> {item.action}
                </button>
                <p className="text-gray-800 text-lg font-medium bg-gray-100 p-4 rounded-lg shadow-sm">{item.history}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Student Appointments Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">My Appointments</h2>
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
                  <th className="px-4 py-2 border-b text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id || appointment.id}>
                    <td className="px-4 py-2 border-b">{appointment.doctorName || appointment.doctor?.name || 'Not specified'}</td>
                    <td className="px-4 py-2 border-b">{formatDate(appointment.date)}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">{appointment.description || appointment.reason || 'No description'}</td>
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
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Health Records</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : healthRecords.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">ID</th>
                  <th className="px-4 py-2 border-b text-left">Diagnosis</th>
                  <th className="px-4 py-2 border-b text-left">Date</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="px-4 py-2 border-b">{record._id}</td>
                    <td className="px-4 py-2 border-b">{record.diagnosis}</td>
                    <td className="px-4 py-2 border-b">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">
                      <button onClick={() => viewHealthRecordDetails(record._id)} className="text-blue-600 hover:underline mr-4">
                        View
                      </button>
                      <button onClick={() => deleteHealthRecord(record._id)} className="text-red-600 hover:underline">
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
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Health Record Details</h2>
            <p><strong>ID:</strong> {selectedRecord._id}</p>
            <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</p>
            <p><strong>Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}</p>
            <p><strong>Treatment:</strong> {selectedRecord.treatment || "N/A"}</p>
            <p><strong>Prescription:</strong> {selectedRecord.prescription || "N/A"}</p>
            <button onClick={() => setSelectedRecord(null)} className="text-red-600 hover:underline">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
