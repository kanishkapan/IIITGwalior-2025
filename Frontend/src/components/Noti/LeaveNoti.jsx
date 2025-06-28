
// Filename: LeaveNoti.jsx
import React from "react";
import { Calendar } from "lucide-react";

const LeaveNoti = ({ student, reason, startDate, endDate }) => {
  return (
    <div className="bg-green-50 border border-green-500 shadow-lg rounded-2xl p-4 w-96 flex items-center gap-4">
      <div className="bg-green-100 p-3 rounded-full">
        <Calendar className="text-green-600" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-800">
          Medical Leave Request
        </h3>
        <p className="text-sm text-green-700">
          {student} has applied for medical leave from {startDate} to {endDate} due to {reason}.
        </p>
        <button className="mt-2 bg-green-600 text-white hover:bg-green-700 rounded-lg px-4 py-2 text-sm">
          Approve Request
        </button>
      </div>
    </div>
  );
};


export default LeaveNoti;