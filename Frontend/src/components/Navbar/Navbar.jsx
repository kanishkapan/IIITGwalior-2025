import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";
import { api } from "../../axios.config.js"; // Import Axios instance

const Navbar = React.memo(() => {
  const { isLoggedIn, user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post("user/logout"); // Call logout endpoint
      logout(); // Update local state
      navigate("/"); // Navigate to home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md font-ubuntu">
      <div className="flex items-center space-x-2">
        <span className="text-green-500 text-2xl font-bold">✦</span>
        <Link to="/" className="text-xl font-bold">ArogyaVault</Link>
      </div>

      <ul className="hidden md:flex space-x-6 text-lg text-gray-700">
        <li><Link to="/" className="hover:text-green-500">Home</Link></li>
        <li><Link to="/ai-bot" className="hover:text-green-500">AI Bot</Link></li>
        <li><Link to="/telemedicine" className="hover:text-green-500">Telemedicine</Link></li>
        <li><Link to="/contact" className="hover:text-green-500">Contact</Link></li>
        
        <li><Link to="/appointment" className="hover:text-green-500">Appointment</Link></li>
        <li><Link to="/video-call" className="hover:text-green-500">Video Call</Link></li>
      </ul>

      <div className="hidden md:flex space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <Link to="/profile">
              <div className="rounded-full bg-gray-200 w-8 h-8 flex justify-center items-center">
                {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </Link>
            <button onClick={handleLogout} className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/signup">
              <button className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400">Login</button>
            </Link>
          </>
        )}
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
          <div onClick={() => {
            navigate("/");
            toggleMenu();
          }} className="text-lg hover:text-green-500 cursor-pointer">Home</div>
          <div onClick={() => {
            navigate("/ai-bot");
            toggleMenu();
          }} className="text-lg hover:text-green-500 cursor-pointer">AI Bot</div>
          <div onClick={() => {
            navigate("/telemedicine");
            toggleMenu();
          }} className="text-lg hover:text-green-500 cursor-pointer">Telemedicine</div>
          <div onClick={() => {
            navigate("/contact");
            toggleMenu();
          }} className="text-lg hover:text-green-500 cursor-pointer">Contact</div>
        
          <div onClick={() => {
            navigate("/appointment");
            toggleMenu();
          }} className="text-lg hover:text-green-500 cursor-pointer">Appointment</div>
          <div onClick={() => {
            navigate("/video-call");
            toggleMenu();
          }} className="text-lg hover:text-green-500 cursor-pointer">Video Call</div>

          {isLoggedIn ? (
            <div className="flex flex-col space-y-2">
              <div onClick={() => {
                navigate("/profile");
                toggleMenu();
              }} className="text-lg hover:text-green-500 cursor-pointer">Profile</div>
              <button onClick={handleLogout} className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400 text-center">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/signup" className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400 text-center" onClick={toggleMenu}>Sign Up</Link>
              <Link to="/login" className="bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400 text-center" onClick={toggleMenu}>Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
