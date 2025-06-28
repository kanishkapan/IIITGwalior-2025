import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie } from 'recharts';
import { Bell, Settings, Search, Eye, Calendar, FileText, User, UserPlus, Users, Activity, AlertCircle } from 'lucide-react';
import {api} from '../../axios.config';
import Notibell from '../Noti/Notibell';
import socket from "../../socket"; // Make sure it's the same shared socket instance
import { showAlert } from '../alert-system';

const AdminDashboard = () => {
  // Sample data for student leave applications
  const [leaveApplications, setLeaveApplications] = useState([]);
  
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Sample data for health records
  const [healthRecords, setHealthRecords] = useState([]);

  // New states for search suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/medical-leaves/healthrecord"); // Replace with your API endpoint
        console.log("API Response:", response.data);
        
        const formattedData = response.data.map(record => ({
          ...record,
          docUrls: record.attachments
            ? record.attachments.map(att => ({
                url: att.url || "#", // Fallback URL
                format: att.url ? att.url.split('.').pop().toLowerCase() : "unknown", // Fallback format
              }))
            : [],
        }));
  
        setHealthRecords(formattedData);
      } catch (error) {
        console.error("Error fetching health records:", error);
      }
    };
  
    fetchHealthRecords();
  }, []);
  
  // Sample data for doctors
  const [doctors] = useState([
    { id: 'DOC001', name: 'Dr. Emily Chen', specialization: 'General Medicine', contact: '+1-555-0123', availability: 'Mon, Wed, Fri' },
    { id: 'DOC002', name: 'Dr. James Wilson', specialization: 'Orthopedics', contact: '+1-555-0124', availability: 'Tue, Thu' },
    { id: 'DOC003', name: 'Dr. Maria Garcia', specialization: 'Psychiatry', contact: '+1-555-0125', availability: 'Mon, Thu, Fri' },
    { id: 'DOC004', name: 'Dr. Robert Thompson', specialization: 'Dermatology', contact: '+1-555-0126', availability: 'Wed, Fri' }
  ]);

  // Statistics for dashboard charts
  const healthIssuesData = [
    { name: 'Respiratory', value: 35 },
    { name: 'Digestive', value: 20 },
    { name: 'Mental Health', value: 25 },
    { name: 'Injury', value: 15 },
    { name: 'Other', value: 5 }
  ];

  const monthlyData = [
    { month: 'Jan', checkups: 45, emergencies: 12 },
    { month: 'Feb', checkups: 52, emergencies: 15 },
    { month: 'Mar', checkups: 38, emergencies: 10 },
    { month: 'Apr', checkups: 30, emergencies: 8 },
    { month: 'May', checkups: 25, emergencies: 6 },
    { month: 'Jun', checkups: 32, emergencies: 9 }
  ];

  // State for active tab
  const [activeTab, setActiveTab] = useState('leave');

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await api.get("/medical-leaves");
        setLeaveApplications(response.data);
      } catch (error) {
        console.error("Error fetching leave applications:", error);
      }
    };
    fetchLeaveApplications();
    
    socket.on("newLeaveNotification", (data) => {
      console.log("📬 Leave notification received in dashboard:", data);
      
      if (data.notification) {
        showAlert(data.notification.message);
      }
      console.log('leave object is ', data.leave);
      
      if (data.leave) {
        setLeaveApplications((prev) => {
          // Ensure we always use _id as the identifier from backend, but store as id in frontend
          const leaveId = data.leave._id;
          
          const formattedLeave = {
            ...data.leave,
            id: leaveId, // Store as id for frontend consistency
            duration: `${data.leave.fromDate} to ${data.leave.toDate}`
          };
    
          // Check if item exists using the id property that our frontend uses
          const exists = prev.some((item) => item.id === leaveId);
          
          if (exists) {
            return prev.map((item) =>
              item.id === leaveId ? { ...item, ...formattedLeave } : item
            );
          } else {
            return [formattedLeave, ...prev];
          }
        });
      }
    });
    
    return () => {
      socket.off("newLeaveNotification");
    };
}, []);

  // Debounced API call for search suggestions
      useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (searchQuery) {
            api
              .get("/medical-leaves/searchSuggestions", { params: { query: searchQuery } })
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
        .get("/medical-leaves/search", { params: { query: suggestion } })
        .then((res) => {
          setSearchResults(res.data);
        })
        .catch((err) => {
          console.error("Error fetching search results:", err);
          setSearchResults([]);
        });
    };

    const updateLeaveStatus = async (id, status) => {
      try {
        await api.patch(`/medical-leaves/${id}/status`, { status });
        // Refresh the leave applications after updating
        const response = await api.get("/medical-leaves");
        setLeaveApplications(response.data);
      } catch (error) {
        console.error("Error updating leave status:", error);
      }
    };
  const [selectedLeave, setSelectedLeave] = useState(null);

  const viewLeaveDetails = async (id) => {
    try {
      const response = await api.get(`/medical-leaves/${id}/details`);
      setSelectedLeave({
        ...response.data,
        docUrls: response.data.supportingDocuments 
          ? response.data.supportingDocuments.map(att => ({
              url: att.url,
              format: att.url.split('.').pop().toLowerCase()
            }))
          : []
      });
    } catch (error) {
      console.error("Error fetching leave details:", error);
      // Display an error message to the user
      alert("An error occurred while fetching leave details. Please try again later.");
    }
  };
  
    
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r">
        <h2 className="text-xl font-bold text-blue-600 mb-6">MediCollege Admin</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-600 bg-blue-50 text-blue-600 rounded">
            <Activity className="w-5 h-5 mr-2" /> 
            <span className="text-lg font-medium">Dashboard</span>
          </Link>
          {[
            { name: 'Students', icon: Users },
            { name: 'Leave Applications', icon: FileText },
            { name: 'Health Records', icon: Activity },
            { name: 'Doctors', icon: User },
           
           
          ].map(item => (
            <Link key={item.name} to={`/${item.name.toLowerCase().replace(' ', '-')}`} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <item.icon className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">College Medical Admin Dashboard</h1>
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
            <Notibell className="w-6 h-6 text-gray-400 cursor-pointer" />
          
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Students', value: '2,450', color: 'bg-blue-600', icon: Users },
            { title: 'Pending Leaves', value: '24', color: 'bg-yellow-500', icon: FileText },
            { title: 'Open Health Cases', value: '18', color: 'bg-red-500', icon: AlertCircle },
            { title: 'Available Doctors', value: '12', color: 'bg-green-600', icon: User }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className={`${item.color} p-3 rounded-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-500 text-sm">Last 30 days</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
              <p className="text-gray-600">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('leave')} 
              className={`pb-4 px-1 ${activeTab === 'leave' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Leave Applications
            </button>
            <button 
              onClick={() => setActiveTab('health')} 
              className={`pb-4 px-1 ${activeTab === 'health' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Health Records
            </button>
            <button 
              onClick={() => setActiveTab('doctors')} 
              className={`pb-4 px-1 ${activeTab === 'doctors' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Doctors
            </button>
            <button 
              onClick={() => setActiveTab('analytics')} 
              className={`pb-4 px-1 ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border p-6">
          {/* Leave Applications Tab */}
          {activeTab === 'leave' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Leave Applications</h2>
                <div className="flex space-x-2">
                  <select className="border rounded-lg px-3 py-2">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" /> New Application
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead> 
                  <tbody className="bg-white divide-y divide-gray-200">
  {[...leaveApplications]
        .sort((a, b) => {
          const aStart = new Date(a.duration.split(" to ")[0]);
          const bStart = new Date(b.duration.split(" to ")[0]);
          return bStart - aStart; // Sort by startDate (descending)
        })
        .map((app,index) => (
    <tr key={app._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.gender}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.duration}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.diagnosis}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          app.status === 'approved' ? 'bg-green-100 text-green-800' : 
          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {app.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button onClick={() => viewLeaveDetails(app.id)} className="text-blue-600 hover:text-blue-900 mr-3">View</button>
        {app.status === 'pending' && (
          <>
            <button onClick={() => updateLeaveStatus(app.id, 'approved')} className="text-green-600 hover:text-green-900 mr-3">Approve</button>
            <button onClick={() => updateLeaveStatus(app.id, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
          </>
        )}
      </td>
    </tr>
  ))}
  </tbody>

                </table>
                {selectedLeave && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Leave Details</h3>
      <p><strong>Student:</strong> {selectedLeave.studentName}</p>
      <p><strong>StudentId:</strong> {selectedLeave.studentId}</p>
      <p><strong>gender:</strong> {selectedLeave.gender}</p>
      <p><strong>Duration:</strong> {selectedLeave.duration}</p>
      <p><strong>Reason:</strong> {selectedLeave.reason}</p>
      <p><strong>Status:</strong> {selectedLeave.status}</p>
      <p><strong>Email:</strong> {selectedLeave.email}</p>
      <p><strong>Phone:</strong> {selectedLeave.phone}</p>
      <p><strong>DOB:</strong> {selectedLeave.dateOfBirth}</p>
      <p><strong>health issue:</strong> {selectedLeave.diagnosis}</p>
      <p><strong>Doctor:</strong> {selectedLeave.doctorName}</p>
      <p><strong>treatment:</strong> {selectedLeave.treatment}</p>
      <p><strong>prescription:</strong> {selectedLeave.prescription}</p>
      {selectedLeave.docUrls && selectedLeave.docUrls.length > 0 && (
  <div className="mt-4">
    <h4 className="font-semibold">Supporting documents:</h4>
    {selectedLeave.docUrls.map((attachment, index) => (
      <div key={index} className="mt-2">
        {attachment.format === 'pdf' ? (
          <iframe
            src={`${attachment.url}#view=FitH`}
            className="w-full h-64 border border-gray-300"
            title={`PDF Attachment ${index + 1}`}
          ></iframe>
        ) : (
          <img
            src={attachment.url}
            alt={`Image Attachment ${index + 1}`}
            className="max-w-full h-auto border border-gray-300"
          />
        )}
        <a 
          href={attachment.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline block mt-2"
        >
          Download {attachment.format.toUpperCase()}
        </a>
      </div>
    ))}
  </div>
)}



  
      
      <button
        onClick={() => setSelectedLeave(null)}
        className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}

              </div>
            </div>
          )}

          {/* Health Records Tab */}
          {activeTab === 'health' && (
  <div className="w-full max-w-full">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
      <h2 className="text-xl font-semibold">Student Health Records</h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input 
          type="text" 
          placeholder="Search by ID or Name" 
          className="border rounded-lg px-3 py-2 w-full sm:w-auto" 
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 mr-2" /> Add Record
        </button>
      </div>
    </div>
    
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[8%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
              <th className="w-[14%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="w-[12%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="w-[10%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="w-[14%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
              <th className="w-[12%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="w-[14%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
              <th className="w-[16%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {healthRecords.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 truncate">{index + 1}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate">{record.studentName}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate">{record.studentId}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate">{record.gender}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate">{record.diagnosis}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate">{record.date}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate">{record.prescription}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm truncate">
                  {record.docUrls && record.docUrls.length > 0 ? (
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                    >
                      View Attachments
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs sm:text-sm">No Attachments</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 sm:pt-10">
          <div className="relative mx-auto p-4 sm:p-5 border w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium leading-none mb-4">
              Attachments for {selectedRecord.studentName}
            </h3>

            {/* Render Attachments */}
            {selectedRecord.docUrls.map((attachment, index) => (
              <div key={index} className="mt-4">
                {attachment.format === 'pdf' ? (
                  // Render PDF
                  <iframe
                    src={`${attachment.url}#view=FitH`}
                    title={`Attachment ${index + 1}`}
                    frameBorder={1}
                    width="100%"
                    height={300}
                    className="border border-gray-300"
                  ></iframe>
                ) : (
                  // Render Image
                  <img
                    src={attachment.url}
                    alt={`Attachment ${index + 1}`}
                    className="max-w-full h-auto border border-gray-300 mx-auto"
                  />
                )}
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mt-2"
                >
                  Download {attachment.format.toUpperCase()}
                </a>
              </div>
            ))}

            {/* Close Button */}
            <div className="flex justify-center sm:justify-end mt-5">
              <button
                onClick={() => setSelectedRecord(null)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">College Medical Staff</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" /> Add Doctor
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-xl p-6 flex">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                      {doctor.name.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                      <p className="text-gray-600 mt-1">{doctor.contact}</p>
                      <p className="text-gray-600">Available: {doctor.availability}</p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">View Schedule</button>
                        <button className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-lg">Contact</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Health Analytics</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Monthly Health Visits</h3>
                  <BarChart width={500} height={300} data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="checkups" fill="#82ca9d" name="Regular Checkups" />
                    <Bar dataKey="emergencies" fill="#8884d8" name="Emergency Visits" />
                  </BarChart>
                </div>

                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Common Health Issues</h3>
                  <PieChart width={500} height={300}>
                    <Pie 
                      data={healthIssuesData} 
                      cx={250} 
                      cy={150} 
                      innerRadius={60} 
                      outerRadius={80} 
                      fill="#8884d8" 
                      paddingAngle={5} 
                      dataKey="value" 
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            </div>
          )}
        </div>
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

export default AdminDashboard;