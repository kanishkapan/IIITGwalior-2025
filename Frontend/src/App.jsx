import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar/Navbar";
import HomePage from "./Pages/HomePage";
import PatientForm from "./Pages/PatientForm";
import Aibot from "./Pages/Aibot";
import Booking from "./Pages/Booking";
import Contact from "./Pages/Contact";
import Telemedicine from "./Pages/telemedicine";
import VideoCall from "./Pages/VideoCall";
import DoctorsDashboard from "./Pages/DoctorsDashboard";
import Dashboard from "./components/StudentDashboard/Dashboard";
const Home = () => <div className="text-center mt-10">🏠 Welcome to Home</div>;
const AIBot = () => <div className="text-center mt-10">🤖 AI Bot Page</div>;

const Appointment = () => <div className="text-center mt-10">📅 Appointment Page</div>;
const SignUp = () => <div className="text-center mt-10">📝 Sign Up Page</div>;
const Login = () => <div className="text-center mt-10">🔑 Login Page</div>;

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>  
        <Route path="/" element={<HomePage/>}/>
        <Route path="/ai-bot" element={<Aibot />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/appointment" element={<Booking />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientForm />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/doctor" element={<DoctorsDashboard />} />
       
      </Routes>
    </Router>
  );
};

export default App;
