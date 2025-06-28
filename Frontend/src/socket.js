import { io } from "socket.io-client";
const getToken = () => localStorage.getItem("token");


const socket = io("http://localhost:3053", {  // Change URL if needed
  withCredentials: true,
  transports: ["websocket"],
  auth:{ token: getToken() },
});

// const token = localStorage.getItem("token");
socket.on("connect", () => {
  console.log("Connected to Socket.io server with ID:", socket.id);
  
  const token = getToken();
  if (token) {
    console.log("Token found, authenticating...");
    socket.emit("authenticate", token); // Send token for authentication
  } else {
    console.warn("No token found, user might not be authenticated!");
  }


});

//Notification
// socket.on("newAppointment", (data) => {
//   console.log("New Appointment Notification:", data);
//   alert(data.message);
// });

socket.on("appointmentUpdate", (data) => {
  console.log("Appointment Update Notification:", data);
  alert(data.message);
});
socket.on("newLeaveRequest", (data) => {
  console.log("newLeave Request:",data);
  alert(`${data.message}`);
});

socket.on("leaveStatusUpdate", (data) => {
  console.log("Leave status updated: ",data);
  alert(`${data.message}`);
});


export default socket;
