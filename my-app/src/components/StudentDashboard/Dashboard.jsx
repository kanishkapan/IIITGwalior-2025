import React from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Bell, Settings, Search } from 'lucide-react';

const Dashboard = () => {
  // Weekly activity data
  const weeklyData = [
    { day: 'Sat', patients: 45, surgeries: 22 },
    { day: 'Sun', patients: 32, surgeries: 15 },
    { day: 'Mon', patients: 38, surgeries: 25 },
    { day: 'Tue', patients: 42, surgeries: 28 },
    { day: 'Wed', patients: 35, surgeries: 20 },
    { day: 'Thu', patients: 40, surgeries: 24 },
    { day: 'Fri', patients: 38, surgeries: 26 }
  ];

  // Department statistics
  const departmentData = [
    { name: 'Cardiology', value: 30 },
    { name: 'Neurology', value: 35 },
    { name: 'Pediatrics', value: 20 },
    { name: 'Orthopedics', value: 15 }
  ];

  // Recent patients data
  const recentPatients = [
    { name: 'Sarah Johnson', date: '28 January 2024', type: 'Emergency', amount: '-$850' },
    { name: 'Mike Peters', date: '25 January 2024', type: 'Checkup', amount: '+$2,500' },
    { name: 'Emma Wilson', date: '21 January 2024', type: 'Surgery', amount: '+$5,400' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r">
        <div className="flex items-center mb-8">
          <div className="text-xl font-bold text-blue-600">MediSense</div>
        </div>
        
        <nav className="space-y-2">
          <div className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded">
            <span className="ml-2">Dashboard</span>
          </div>
          {['Appointments', 'Patients', 'Doctors', 'Departments', 'Analytics', 'Reports', 'Settings'].map(item => (
            <div key={item} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
              <span className="ml-2">{item}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Overview</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
            <Bell className="w-6 h-6 text-gray-400" />
            <Settings className="w-6 h-6 text-gray-400" />
            <img
              src="/api/placeholder/32/32"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="text-sm mb-2">DOCTOR ID</div>
            <div className="text-2xl font-bold mb-4">DR-3778 1234</div>
            <div className="flex justify-between">
              <div>
                <div className="text-sm opacity-75">NAME</div>
                <div>Dr. Edward Smith</div>
              </div>
              <div>
                <div className="text-sm opacity-75">VALID THRU</div>
                <div>12/25</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <div className="text-sm mb-2">LICENSE ID</div>
            <div className="text-2xl font-bold mb-4">ML-3778 1234</div>
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-500">NAME</div>
                <div>Dr. Edward Smith</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">VALID THRU</div>
                <div>12/25</div>
              </div>
            </div>
          </div>
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
              <Pie
                data={departmentData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Patients</h2>
            <button className="text-blue-600">See All</button>
          </div>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.date}</div>
                  </div>
                </div>
                <div className={patient.amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                  {patient.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;