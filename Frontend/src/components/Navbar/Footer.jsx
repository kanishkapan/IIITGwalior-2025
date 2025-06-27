import { FaLinkedin, FaFacebook } from "react-icons/fa";
import React from 'react'
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 md:p-10 rounded-t-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Left Section */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h3 className="text-green-400 font-semibold mb-2">Contact us:</h3>
          <p>Email: info@jivika.com</p>
          <p>Phone: 555-567-8901</p>
          <p>Address: 1234 Main St</p>
          <p>Moonstone City, Stardust State 12345</p>
        </div>

        {/* Subscription Box */}
        <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-500 focus:outline-none"
          />
          <button className="bg-green-400 text-black px-4 py-2 rounded-md font-semibold">
            Subscribe to news
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-4">
        <p className="text-sm">&copy; 2023 Dr.Jivika. All Rights Reserved.</p>
        <a href="#" className="text-sm text-gray-400 hover:underline">
          Privacy Policy
        </a>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center md:justify-end max-w-6xl mx-auto mt-4 space-x-4">
        <FaLinkedin className="text-white text-xl cursor-pointer" />
        <FaFacebook className="text-white text-xl cursor-pointer" />
      </div>
    </footer>
  );
};

export default Footer;