import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie } from 'recharts';
import { Bell, Settings, Search, Eye, Calendar, FileText, User, UserPlus, Users, Activity, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  // Sample data for student leave applications
  const [leaveApplications] = useState([
    { id: 'LA001', studentName: 'John Smith', studentId: 'STU10045', gender: 'Male', fromDate: '2025-03-10', toDate: '2025-03-15', reason: 'Medical', status: 'Pending' },
    { id: 'LA002', studentName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', fromDate: '2025-03-12', toDate: '2025-03-14', reason: 'Family Emergency', status: 'Approved' },
    { id: 'LA003', studentName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', fromDate: '2025-03-15', toDate: '2025-03-18', reason: 'Medical', status: 'Pending' },
    { id: 'LA004', studentName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', fromDate: '2025-03-18', toDate: '2025-03-20', reason: 'Personal', status: 'Rejected' }
  ]);

  // Sample data for health records
  const [healthRecords] = useState([
    { id: 'HR001', studentName: 'John Smith', studentId: 'STU10045', gender: 'Male', diagnosis: 'Seasonal Flu', date: '2025-03-10', prescription: 'Paracetamol 500mg, twice daily', attachment: 'flu_report.pdf' },
    { id: 'HR002', studentName: 'Emma Johnson', studentId: 'STU10078', gender: 'Female', diagnosis: 'Migraine', date: '2025-03-05', prescription: 'Sumatriptan 50mg, as needed', attachment: 'migraine_report.pdf' },
    { id: 'HR003', studentName: 'Michael Wang', studentId: 'STU10023', gender: 'Male', diagnosis: 'Sprained Ankle', date: '2025-03-08', prescription: 'Rest, Ice, Compression, Elevation; Ibuprofen 400mg', attachment: 'xray_ankle.pdf' },
    { id: 'HR004', studentName: 'Sarah Miller', studentId: 'STU10091', gender: 'Female', diagnosis: 'Allergic Rhinitis', date: '2025-03-11', prescription: 'Cetirizine 10mg, once daily', attachment: 'allergy_test.pdf' }
  ]);

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
            { name: 'Appointments', icon: Calendar },
            { name: 'Reports', icon: AlertCircle },
            { name: 'Settings', icon: Settings }
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
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-lg" />
            </div>
            <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer" />
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.fromDate} to {app.toDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          {app.status === 'Pending' && (
                            <>
                              <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                              <button className="text-red-600 hover:text-red-900">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Health Records Tab */}
          {activeTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Health Records</h2>
                <div className="flex space-x-2">
                  <input type="text" placeholder="Search by ID or Name" className="border rounded-lg px-3 py-2" />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Add Record
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {healthRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.diagnosis}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{record.prescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">{record.attachment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 flex items-center">
                            <Eye className="w-4 h-4 mr-1" /> View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      </div>
    </div>
  );
};

export default AdminDashboard;