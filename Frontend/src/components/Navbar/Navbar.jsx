import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md font-ubuntu">
      <div className="flex items-center space-x-2">
        <span className="text-green-500 text-2xl font-bold">✦</span>
        <Link to="/" className="text-xl font-bold">Dr.Jivika</Link>
      </div>
      <ul className="hidden md:flex space-x-6 text-lg text-gray-700">
        <li><Link to="/" className="cursor-pointer hover:text-green-500">Home</Link></li>
        <li><Link to="/ai-bot" className="cursor-pointer hover:text-green-500">AI Bot</Link></li>
        <li><Link to="/telemedicine" className="cursor-pointer hover:text-green-500">Telemedicines</Link></li>
        <li><Link to="/contact" className="cursor-pointer hover:text-green-500">Contact</Link></li>
        <li><Link to="/profile" className="cursor-pointer hover:text-green-500">Profile</Link></li>
        <li><Link to="/appointment" className="cursor-pointer hover:text-green-500">Appointment</Link></li>
        <li><Link to="/video-call" className="cursor-pointer hover:text-green-500">Video Call</Link></li>
      </ul>
      <div className="flex space-x-4">
        <Link to="/signup">
          <button className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">
            Login In
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
