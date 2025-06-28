import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md font-ubuntu">
      <div className="flex items-center space-x-2">
        <span className="text-green-500 text-2xl font-bold">✦</span>
        <Link to="/" className="text-xl font-bold">Dr.Jivika</Link>
      </div>
      
      <ul className="hidden md:flex space-x-6 text-lg text-gray-700">
        <li><Link to="/" className="hover:text-green-500">Home</Link></li>
        <li><Link to="/ai-bot" className="hover:text-green-500">AI Bot</Link></li>
        <li><Link to="/telemedicine" className="hover:text-green-500">Telemedicine</Link></li>
        <li><Link to="/contact" className="hover:text-green-500">Contact</Link></li>
        <li><Link to="/profile" className="hover:text-green-500">Profile</Link></li>
        <li><Link to="/appointment" className="hover:text-green-500">Appointment</Link></li>
        <li><Link to="/video-call" className="hover:text-green-500">Video Call</Link></li>
      </ul>
      
      <div className="hidden md:flex space-x-4">
        <Link to="/signup">
          <button className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">Login</button>
        </Link>
      </div>
      
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg p-6 flex flex-col space-y-6 md:hidden z-50">
          <button onClick={toggleMenu} className="text-2xl self-end">
            <FiX />
          </button>
          <Link to="/" className="text-lg hover:text-green-500" onClick={toggleMenu}>Home</Link>
          <Link to="/ai-bot" className="text-lg hover:text-green-500" onClick={toggleMenu}>AI Bot</Link>
          <Link to="/telemedicine" className="text-lg hover:text-green-500" onClick={toggleMenu}>Telemedicine</Link>
          <Link to="/contact" className="text-lg hover:text-green-500" onClick={toggleMenu}>Contact</Link>
          <Link to="/profile" className="text-lg hover:text-green-500" onClick={toggleMenu}>Profile</Link>
          <Link to="/appointment" className="text-lg hover:text-green-500" onClick={toggleMenu}>Appointment</Link>
          <Link to="/video-call" className="text-lg hover:text-green-500" onClick={toggleMenu}>Video Call</Link>
          <Link to="/signup" className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400 text-center" onClick={toggleMenu}>Sign Up</Link>
          <Link to="/login" className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400 text-center" onClick={toggleMenu}>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;