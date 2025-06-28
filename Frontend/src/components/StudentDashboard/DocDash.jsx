import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie } from 'recharts';
import { Bell, Settings, Search, Eye, Calendar, FileText, User, Check, X, Video, Clock, Bot, MessageSquare, Activity, AlertCircle, FileCheck } from 'lucide-react';
import { api } from '../../axios.config.js';
import { useNavigate } from "react-router-dom";

const DocDash = () => {
  // Sample data for student certificates
  const [certificates] = useState([
    { id: 'CERT001', studentName: 'John Smith', studentId: 'STU10045', gender: 'Male', certificateType: 'Medical Fitness', issueDate: '2025-02-15', expiryDate: '2026-02-15', documentLink: 'fitness_cert.pdf', status: 'Pending' },
    { id: 'CERT002', studentName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', certificateType: 'Vaccination Record', issueDate: '2025-01-20', expiryDate: '2030-01-20', documentLink: 'vacc_record.pdf', status: 'Approved' },
    { id: 'CERT003', studentName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', certificateType: 'Mental Health Clearance', issueDate: '2025-03-05', expiryDate: '2025-09-05', documentLink: 'mh_clearance.pdf', status: 'Pending' },
    { id: 'CERT004', studentName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', certificateType: 'Physical Examination', issueDate: '2025-02-28', expiryDate: '2026-02-28', documentLink: 'physical_exam.pdf', status: 'Rejected' }
  ]);
  const navigate = useNavigate();

  // Replace static appointment sample data with dynamic state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Sample data for prescriptions
  const [prescriptions] = useState([
    { id: 'PRE001', studentName: 'John Smith', studentId: 'STU10045', gender: 'Male', medication: 'Paracetamol 500mg', dosage: 'Twice daily for 5 days', issuedDate: '2025-03-10', notes: 'Take after meals', status: 'Pending' },
    { id: 'PRE002', studentName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', medication: 'Sumatriptan 50mg', dosage: 'As needed, max 2 tablets per day', issuedDate: '2025-03-05', notes: 'For migraine attacks only', status: 'Approved' },
    { id: 'PRE003', studentName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', medication: 'Ibuprofen 400mg', dosage: 'Three times daily for 7 days', issuedDate: '2025-03-08', notes: 'For pain and inflammation', status: 'Pending' },
    { id: 'PRE004', studentName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', medication: 'Cetirizine 10mg', dosage: 'Once daily', issuedDate: '2025-03-11', notes: 'Take in the evening', status: 'Rejected' }
  ]);

  // Remove static sample data for video call appointments and use dynamic state instead
  const [videoAppointments, setVideoAppointments] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoError, setVideoError] = useState(null);

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
  const [activeTab, setActiveTab] = useState('certificate');

  // Helper function to format date in DD/month name/yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch appointments whenever the status or date filter changes
  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      let queryParams = {};
      if (statusFilter && statusFilter !== 'All Status') {
        queryParams.status = statusFilter;
      }
      if (dateFilter) {
        queryParams.date = dateFilter;
      }
      const response = await api.get('/doctor/appointment', { params: queryParams });
      const formattedAppointments = response.data.map(app => ({
        id: app._id,
        patientName: app.studentId?.name || 'Unknown Patient',
        studentId: app.studentId?._id || 'N/A',
        studentEmail: app.studentId?.email || 'N/A',
        appointmentDate: new Date(app.slotDateTime).toLocaleDateString(),
        timeFrom: new Date(app.slotDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeTo: calculateEndTime(app.slotDateTime, app.duration || 30),
        reason: app.reason || 'General Checkup',
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointmentsError('Failed to load appointments. Please try again later.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Helper to calculate end time based on start time and duration
  const calculateEndTime = (startDateTime, durationMinutes) => {
    const endTime = new Date(new Date(startDateTime).getTime() + durationMinutes * 60000);
    return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Update appointment status and update the local state
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/doctor/${appointmentId}/appointment-status`, { status: newStatus.toLowerCase() });
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app.id === appointmentId
            ? { ...app, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }
            : app
        )
      );
    } catch (error) {
      console.error(`Error updating appointment to ${newStatus}:`, error);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  // Function to view appointment details (for example, opening a modal)
  const viewAppointmentDetails = (appointment) => {
    console.log('View appointment details:', appointment);
  };

  // New: Fetch video appointments from the API when the Video tab is active
  useEffect(() => {
    if (activeTab === 'video') {
      fetchVideoAppointments();
    }
  }, [activeTab]);

  const fetchVideoAppointments = async () => {
    try {
      setLoadingVideo(true);
      const response = await api.get('/doctor/appointment', { params: { status: 'confirmed' } });
      const formattedVideoAppointments = response.data.map(app => ({
        id: app._id,
        patientName: app.studentId?.name || 'Unknown Patient',
        studentId: app.studentId?._id || 'N/A',
        appointmentDate: formatDate(app.slotDateTime),
        time: new Date(app.slotDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app
      }));
      setVideoAppointments(formattedVideoAppointments);
    } catch (error) {
      console.error('Error fetching video appointments:', error);
      setVideoError('Failed to load video appointments. Please try again later.');
    } finally {
      setLoadingVideo(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r">
        <h2 className="text-xl font-bold text-blue-600 mb-6">MediCollege Doctor</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-600 bg-blue-50 text-blue-600 rounded">
            <Activity className="w-5 h-5 mr-2" /> 
            <span className="text-lg font-medium">Dashboard</span>
          </Link>
          {[
           
            { name: 'Appointments', icon: Calendar },
            { name: 'Prescriptions', icon: FileText },
            { name: 'Video-Call', icon: Video },
            { name: 'AI Assistant', icon: Bot },
          
          ].map(item => (
            <Link key={item.name} to={`/${item.name.toLowerCase().replace(' ', '-')}`} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <item.icon className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          ))}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-md border border-green-500">
      <button
        onClick={() => navigate("/slots")}
        className="px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg transition-all duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
      >
        Select Time Slot
      </button>
    </div>
        </nav>

        {/* AI Bot Section */}
      

        {/* Video Call Section */}
     
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Doctor's Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 border rounded-lg" />
            </div>
            <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer" />
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              D
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { title: "Today's Appointments", value: '8', color: 'bg-blue-600', icon: Calendar },
            { title: 'Pending Certificates', value: '14', color: 'bg-yellow-500', icon: FileCheck },
            { title: 'Active Cases', value: '12', color: 'bg-green-600', icon: Activity },
            { title: 'Video Consultations', value: '5', color: 'bg-purple-600', icon: Video }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className={`${item.color} p-3 rounded-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-500 text-sm">Today</span>
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
              onClick={() => setActiveTab('certificate')} 
              className={`pb-4 px-1 ${activeTab === 'certificate' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Certificate Verification
            </button>
            <button 
              onClick={() => setActiveTab('appointment')} 
              className={`pb-4 px-1 ${activeTab === 'appointment' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Appointment Approval
            </button>
            <button 
              onClick={() => setActiveTab('prescription')} 
              className={`pb-4 px-1 ${activeTab === 'prescription' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Prescription Verification
            </button>
            <button 
              onClick={() => setActiveTab('video')} 
              className={`pb-4 px-1 ${activeTab === 'video' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Video Consultations
            </button>
         
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border p-6">
          {/* Certificate Verification Tab */}


          {activeTab === 'appointment' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-green-800">Appointment Requests</h2>
                <div className="flex space-x-2">
                  <select 
                    className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Approved</option>
                    <option value="cancelled">Rejected</option>
                    <option value="delayed">Delayed</option>
                  </select>
                  <input 
                    type="date" 
                    className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
              {loadingAppointments ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : appointmentsError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {appointmentsError}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Patient Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">From</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                            No appointments found
                          </td>
                        </tr>
                      ) : (
                        appointments.map((app) => (
                          <tr key={app.id} className="hover:bg-green-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id.substring(0, 6)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.patientName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appointmentDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.timeFrom}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.timeTo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                app.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                app.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                app.status === 'Delayed' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                {app.status === 'Pending' ? (
                                  <>
                                    <button 
                                      className="flex items-center text-green-600 hover:text-green-900"
                                      onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                                    >
                                      <Check className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button 
                                      className="flex items-center text-red-600 hover:text-red-900"
                                      onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                                    >
                                      <X className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                    <button 
                                      className="flex items-center text-orange-600 hover:text-orange-900"
                                      onClick={() => updateAppointmentStatus(app.id, 'delayed')}
                                    >
                                      <Clock className="w-4 h-4 mr-1" /> Delay
                                    </button>
                                  </>
                                ) : (
                                  <button 
                                    className="flex items-center text-blue-600 hover:text-blue-900"
                                    onClick={() => viewAppointmentDetails(app)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" /> View
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}  
            </div>
          )}

          {activeTab === 'certificate' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Certificate Verification</h2>
                <div className="flex space-x-2">
                  <select className="border rounded-lg px-3 py-2">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <input type="text" placeholder="Search by ID" className="border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.certificateType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.issueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.expiryDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">{cert.documentLink}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            cert.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            cert.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="flex items-center text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            {cert.status === 'Pending' && (
                              <>
                                <button className="flex items-center text-green-600 hover:text-green-900">
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button className="flex items-center text-red-600 hover:text-red-900">
                                  <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointment Approval Tab */}
         
          {/* Prescription Verification Tab */}
          {activeTab === 'prescription' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Prescription Verification</h2>
                <div className="flex space-x-2">
                  <select className="border rounded-lg px-3 py-2">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <input type="text" placeholder="Search medication" className="border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prescriptions.map((presc) => (
                      <tr key={presc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{presc.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presc.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presc.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presc.medication}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presc.dosage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presc.issuedDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{presc.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            presc.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            presc.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {presc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="flex items-center text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            {presc.status === 'Pending' && (
                              <>
                                <button className="flex items-center text-green-600 hover:text-green-900">
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button className="flex items-center text-red-600 hover:text-red-900">
                                  <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Video Consultation Tab */}
          {activeTab === 'video' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Video Consultations</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                  <Video className="w-4 h-4 mr-2" /> Schedule New Call
                </button>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Today's Video Appointments</h3>
                {loadingVideo ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : videoError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {videoError}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {videoAppointments.length === 0 ? (
                      <div className="col-span-3 text-center text-gray-500">No video appointments found</div>
                    ) : (
                      videoAppointments.map(app => (
                        <div 
                          key={app.id} 
                          className={`p-4 rounded-lg border ${
                            app.status === 'Confirmed' ? 'border-green-500 bg-green-100' :
                            app.status === 'Pending' ? 'border-yellow-500 bg-yellow-100' :
                            'border-red-500 bg-red-100'
                          }`}
                        >
                          <h4 className="font-semibold">{app.patientName}</h4>
                          <p className="text-sm text-gray-600">{app.appointmentDate}</p>
                          <p className="text-sm text-gray-600">{app.time}</p>
                          <p className={`text-sm font-medium ${
                            app.status === 'Confirmed' ? 'text-green-700' :
                            app.status === 'Pending' ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            {app.status}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              {/* Analytics content goes here */}
              <h2 className="text-xl font-semibold">Analytics</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocDash;
