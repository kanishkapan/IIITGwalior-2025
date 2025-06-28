import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie } from 'recharts';
import { Bell, Settings, Search, Upload, Calendar, FileText, MessageCircle } from 'lucide-react';

const Dashboard = () => {
  const weeklyData = [
    { day: 'Sat', patients: 45, surgeries: 22 },
    { day: 'Sun', patients: 32, surgeries: 15 },
    { day: 'Mon', patients: 38, surgeries: 25 },
    { day: 'Tue', patients: 42, surgeries: 28 },
    { day: 'Wed', patients: 35, surgeries: 20 },
    { day: 'Thu', patients: 40, surgeries: 24 },
    { day: 'Fri', patients: 38, surgeries: 26 }
  ];

  const departmentData = [
    { name: 'Cardiology', value: 30 },
    { name: 'Neurology', value: 35 },
    { name: 'Pediatrics', value: 20 },
    { name: 'Orthopedics', value: 15 }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r">
        <h2 className="text-xl font-bold text-blue-600 mb-6">MediSense</h2>
        <nav className="space-y-2">
          {['Dashboard', 'Appointments', 'Patients', 'Doctors', 'Departments', 'Analytics', 'Reports', 'Settings'].map(item => (
            <Link key={item} to={`/${item.toLowerCase()}`} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
              <span className="ml-2 text-lg font-medium">{item}</span>
            </Link>
          ))}
        </nav>
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
            { title: 'Health Records', action: 'Upload Health Record', color: 'bg-blue-600', icon: Upload, history: 'Last uploaded: Blood Test Report - 10th March 2025' },
            { title: 'Leave Applications', action: 'Apply for Leave', color: 'bg-green-600', icon: FileText, history: 'Last leave applied: 5th March 2025 (Medical Leave)' },
            { title: 'Appointments', action: 'Book Appointment', color: 'bg-purple-600', icon: Calendar, history: 'Next appointment: 15th March 2025 - Dr. Smith (Dermatology)' },
            { title: 'AI Chatbot', action: 'AI Chatbot', color: 'bg-yellow-500', icon: MessageCircle, history: 'Last query: "Best home remedies for fever?"' }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{item.title}</h2>
              <button className={`flex items-center justify-center ${item.color} text-white p-4 rounded-xl shadow-md w-full mb-4 text-lg font-semibold`}>
                <item.icon className="mr-2" /> {item.action}
              </button>
              <p className="text-gray-800 text-lg font-medium bg-gray-100 p-4 rounded-lg shadow-sm">{item.history}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
            <BarChart width={500} height={300} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#82ca9d" name="Patients" />
              <Bar dataKey="surgeries" fill="#8884d8" name="Surgeries" />
            </BarChart>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-semibold mb-4">Department Statistics</h2>
            <PieChart width={500} height={300}>
              <Pie data={departmentData} cx={250} cy={150} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
