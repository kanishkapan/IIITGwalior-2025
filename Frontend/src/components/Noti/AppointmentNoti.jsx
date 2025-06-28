import React from "react";
import { Bell } from "lucide-react";

// const AppointmentNoti = ({ student, doctor, time, date }) => {
//   return (
//     <div className="bg-green-50 border border-green-500 shadow-lg rounded-2xl p-4 w-96 flex items-center gap-4">
//       <div className="bg-green-100 p-3 rounded-full">
//         <Bell className="text-green-600" size={24} />
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold text-green-800">
//           Appointment Reminder
//         </h3>
//         <p className="text-sm text-green-700">
//           {student} has an appointment with Dr. {doctor} on {date} at {time}.
//         </p>
//         <button className="mt-2 bg-green-600 text-white hover:bg-green-700 rounded-lg px-4 py-2 text-sm">
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

const AppointmentNoti = ({ notification }) => {
  return (
    <div className="bg-green-50 border border-green-500 shadow-lg rounded-2xl p-4 w-96 flex items-center gap-4">
      <div className="bg-green-100 p-3 rounded-full">
        <Bell className="text-green-600" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-800">
          Appointment Reminder
        </h3>
        <p className="text-sm text-green-700">
          {notification.student} has an appointment with Dr.{" "}
          {notification.doctor} on {notification.date} at {notification.time}.
        </p>
        <button className="mt-2 bg-green-600 text-white hover:bg-green-700 rounded-lg px-4 py-2 text-sm">
          View Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentNoti;


