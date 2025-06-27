import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar/Navbar";
import HomePage from "./Pages/HomePage";
import PatientForm from "./Pages/PatientForm";
import Aibot from "./Pages/Aibot";

const Home = () => <div className="text-center mt-10">🏠 Welcome to Home</div>;
const AIBot = () => <div className="text-center mt-10">🤖 AI Bot Page</div>;
const Contact = () => <div className="text-center mt-10">📞 Contact Page</div>;
const Profile = () => <div className="text-center mt-10">👤 Profile Page</div>;
const Appointment = () => <div className="text-center mt-10">📅 Appointment Page</div>;
const VideoCall = () => <div className="text-center mt-10">📹 Video Call Page</div>;
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientForm />} />
      </Routes>
    </Router>
  );
};

export default App;
