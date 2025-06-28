import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie } from 'recharts';
import { Bell, Settings, Search, Eye, Calendar, FileText, User, Check, X, Video, Clock, Bot, MessageSquare, Activity, AlertCircle, FileCheck,  } from 'lucide-react';

const DocDash = () => {
  // Sample data for student certificates
  const [certificates] = useState([
    { id: 'CERT001', studentName: 'John Smith', studentId: 'STU10045', gender: 'Male', certificateType: 'Medical Fitness', issueDate: '2025-02-15', expiryDate: '2026-02-15', documentLink: 'fitness_cert.pdf', status: 'Pending' },
    { id: 'CERT002', studentName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', certificateType: 'Vaccination Record', issueDate: '2025-01-20', expiryDate: '2030-01-20', documentLink: 'vacc_record.pdf', status: 'Approved' },
    { id: 'CERT003', studentName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', certificateType: 'Mental Health Clearance', issueDate: '2025-03-05', expiryDate: '2025-09-05', documentLink: 'mh_clearance.pdf', status: 'Pending' },
    { id: 'CERT004', studentName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', certificateType: 'Physical Examination', issueDate: '2025-02-28', expiryDate: '2026-02-28', documentLink: 'physical_exam.pdf', status: 'Rejected' }
  ]);

  // Sample data for appointments
  const [appointments] = useState([
    { id: 'APP001', patientName: 'John Smith', studentId: 'STU10045', gender: 'Male', appointmentDate: '2025-03-13', timeFrom: '10:00 AM', timeTo: '10:30 AM', reason: 'Regular Checkup', status: 'Pending' },
    { id: 'APP002', patientName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', appointmentDate: '2025-03-13', timeFrom: '11:00 AM', timeTo: '11:30 AM', reason: 'Migraine Follow-up', status: 'Approved' },
    { id: 'APP003', patientName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', appointmentDate: '2025-03-14', timeFrom: '09:00 AM', timeTo: '09:30 AM', reason: 'Ankle Check', status: 'Pending' },
    { id: 'APP004', patientName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', appointmentDate: '2025-03-14', timeFrom: '02:00 PM', timeTo: '02:30 PM', reason: 'Allergy Consultation', status: 'Delayed' }
  ]);

  // Sample data for prescriptions
  const [prescriptions] = useState([
    { id: 'PRE001', studentName: 'John Smith', studentId: 'STU10045', gender: 'Male', medication: 'Paracetamol 500mg', dosage: 'Twice daily for 5 days', issuedDate: '2025-03-10', notes: 'Take after meals', status: 'Pending' },
    { id: 'PRE002', studentName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', medication: 'Sumatriptan 50mg', dosage: 'As needed, max 2 tablets per day', issuedDate: '2025-03-05', notes: 'For migraine attacks only', status: 'Approved' },
    { id: 'PRE003', studentName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', medication: 'Ibuprofen 400mg', dosage: 'Three times daily for 7 days', issuedDate: '2025-03-08', notes: 'For pain and inflammation', status: 'Pending' },
    { id: 'PRE004', studentName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', medication: 'Cetirizine 10mg', dosage: 'Once daily', issuedDate: '2025-03-11', notes: 'Take in the evening', status: 'Rejected' }
  ]);

  // Sample data for video call appointments
  const [videoAppointments] = useState([
    { id: 'VID001', patientName: 'John Smith', studentId: 'STU10045', appointmentDate: '2025-03-13', timeFrom: '03:00 PM', timeTo: '03:30 PM', status: 'Scheduled' },
    { id: 'VID002', patientName: 'Emma Johnson', studentId: 'STU10078', appointmentDate: '2025-03-13', timeFrom: '04:00 PM', timeTo: '04:30 PM', status: 'In Progress' },
    { id: 'VID003', patientName: 'Michael Wang', studentId: 'STU10023', appointmentDate: '2025-03-14', timeFrom: '01:00 PM', timeTo: '01:30 PM', status: 'Scheduled' }
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
  const [activeTab, setActiveTab] = useState('certificate');

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
            { name: 'Patient Records', icon: User },
            { name: 'Certificates', icon: FileCheck },
            { name: 'Appointments', icon: Calendar },
            { name: 'Prescriptions', icon: FileText },
            { name: 'Video Calls', icon: Video },
            { name: 'AI Assistant', icon: Bot },
            { name: 'Reports', icon: AlertCircle },
            { name: 'Settings', icon: Settings }
          ].map(item => (
            <Link key={item.name} to={`/${item.name.toLowerCase().replace(' ', '-')}`} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <item.icon className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* AI Bot Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-700 flex items-center">
            <Bot className="w-5 h-5 mr-2" /> AI Assistant
          </h3>
          <p className="text-sm text-gray-600 mt-2">Get quick assistance with diagnoses, medical references, and patient recommendations.</p>
          <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center">
            <MessageSquare className="w-4 h-4 mr-2" /> Start Conversation
          </button>
        </div>

        {/* Video Call Section */}
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-700 flex items-center">
            <Video className="w-5 h-5 mr-2" /> Upcoming Video Call
          </h3>
          <div className="mt-2 text-sm">
            <p className="font-medium">Emma Johnson</p>
            <p className="text-gray-600">Today, 4:00 PM - 4:30 PM</p>
            <button className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
              Join Call
            </button>
          </div>
        </div>
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
            { title: 'Today\'s Appointments', value: '8', color: 'bg-blue-600', icon: Calendar },
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
          {/* Certificate Verification Tab */}
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
          {activeTab === 'appointment' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Appointment Requests</h2>
                <div className="flex space-x-2">
                  <select className="border rounded-lg px-3 py-2">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                    <option>Delayed</option>
                  </select>
                  <input type="date" className="border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appointmentDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.timeFrom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.timeTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                            app.status === 'Delayed' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {app.status === 'Pending' && (
                              <>
                                <button className="flex items-center text-green-600 hover:text-green-900">
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button className="flex items-center text-red-600 hover:text-red-900">
                                  <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                                <button className="flex items-center text-orange-600 hover:text-orange-900">
                                  <Clock className="w-4 h-4 mr-1" /> Delay
                                </button>
                              </>
                            )}
                            {app.status !== 'Pending' && (
                              <button className="flex items-center text-blue-600 hover:text-blue-900">
                                <Eye className="w-4 h-4 mr-1" /> View
                              </button>
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
      <div className="grid grid-cols-3 gap-4">
        {videoAppointments.map(app => (
          <div 
            key={app.id} 
            className={`p-4 rounded-lg border ${
              app.status === 'completed' ? 'border-green-500 bg-green-100' :
              app.status === 'pending' ? 'border-yellow-500 bg-yellow-100' :
              'border-red-500 bg-red-100'
            }`}
          >
            <h4 className="font-semibold">{app.patientName}</h4>
            <p className="text-sm text-gray-600">{app.time}</p>
            <p className={`text-sm font-medium ${
              app.status === 'completed' ? 'text-green-700' :
              app.status === 'pending' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {app.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}



</div>
</div>
</div>
  )}

  export default DocDash;