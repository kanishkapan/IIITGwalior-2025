import React,{useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "../src/components/Navbar/Navbar";
import socket from "./socket";

import HomePage from "./Pages/HomePage";
import PatientForm from "./Pages/PatientForm";
import Aibot from "./Pages/Aibot";
import Booking from "./Pages/Booking";
import Contact from "./Pages/Contact";
import Telemedicine from "./Pages/telemedicine";
import VideoCall from "./Pages/VideoCall";
import DoctorsDashboard from "./Pages/DoctorsDashboard";
import Dashboard from "./components/StudentDashboard/Dashboard";
import SignUp from "./components/Login/SignUp";
import Certificates from "./components/medicalcertificate/Certificates";
import Login from "./components/Login/Login";
import MedicalLeave from "./Pages/MedicalLeave";
import ErrorBoundary from "./context/ErrorBoundary";
import MedicalAI from "./components/aifeatures/medicalai";
import MedicalCertificateGenerator from "./components/aifeatures/MedicalCertificateGenerator";
import VerificationScreen from "./components/aifeatures/VerificationScreen";
import Certificate from "./Pages/Certificate";
import AdminDashboard from "./components/StudentDashboard/Admindashboard";
import DocDash from "./components/StudentDashboard/DocDash";
import Predictionchat from "./components/aitanissa/Predictionchat";
import Leavechat from "./components/aitanissa/Leavechat";
import HealthRecordForm from "./components/Healthrecordform/HealthRecordForm";
import DoctorInsightsChat from "./components/aitanissa/DoctorInsightsChat";
import DoctorTimeSlotSelector from "./components/Booking/DoctorTimeSlotSelector";
import PrescriptionGenerator from "./components/aitanissa/PrescriptionGenerator";
import Healthchat from "./components/aitanissa/Healthchat";
import Noti from "./Pages/Noti";
import Payments from "./components/Payments/payment";
import NotiScreen from "./components/Noti/NotiScreen";
import Voice from "./components/Voice Assistant/Voice";
import Notibell from "./components/Noti/Notibell";
const Home = () => <div className="text-center mt-10">🏠 Welcome to Home</div>;
const AIBot = () => <div className="text-center mt-10">🤖 AI Bot Page</div>;

const Appointment = () => <div className="text-center mt-10">📅 Appointment Page</div>;

const App = () => {
  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("WebSocket Connected:", socket.id);
    // });

    // socket.on("disconnect", () => {
    //   console.log("WebSocket Disconnected");
    // });

    socket.on("newAppointment", (data) => {
      console.log(" New Appointment Notification:", data);
      alert(" You have a new appointment request!");
    });

    socket.on("appointmentUpdate", (data) => {
      console.log("Appointment Update:", data);
      alert(`Your appointment has been ${data.appointment.status}`);
    });

    return () => {
      // socket.off("connect");
      // socket.off("disconnect");
      socket.off("newAppointment");
      socket.off("appointmentUpdate");
    };
    
  }, []);

  return (
    <ErrorBoundary>
    <UserProvider>
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
        {/* <Route path="/video-call" element={<VideoCall />} /> */}
        <Route path="/doctor" element={<DocDash />} />
        <Route path="/leave" element={<MedicalLeave />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/health-record-concern" element={<Healthchat />} />
        <Route path="/ai-diagnosis" element={<Predictionchat />} />
        <Route path="/leave-concern" element={<Leavechat />} />
        <Route path="/recordform" element={<HealthRecordForm />} />
        <Route path="/ai-assistant" element={<DoctorInsightsChat />} />
        <Route path="/slots" element={<DoctorTimeSlotSelector />} />
        <Route path="/prescriptions" element={<PrescriptionGenerator />} />
        <Route path="/noti" element={<Noti />} />
        <Route path="/payment" element={<Payments />} />
        <Route path="/notiscreen" element={<NotiScreen />} />
        <Route path="/voice" element={<Voice/>} />
        <Route path="/bell" element={<Notibell/>} />

       
      </Routes>
    </Router>
    </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
