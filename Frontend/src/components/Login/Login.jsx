import React, { useState } from "react";
import { api } from "../../axios.config.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/user/login",
        { email, password },
        { withCredentials: true } // Important for cookies to be stored
      );
      
      //console.log("Success:", response.data);

      if (response.status === 200) {
        const { role } = response.data;
        if (role === "doctor") {
          window.location.href = "/doctor/dashboard";//to be made
        } else if (role === "student") {
          window.location.href = "/profile";
        } else {
          window.location.href = "/admin/dashboard";// to be made
        }
      }
    } catch (error) {
      console.error("Error:", error); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-4xl w-full flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-full flex-col object-cover flex justify-center">
          <h1 className="text-6xl flex-row mb-28 text-center">Log In </h1>
          <img src="../src/assets/sign up page.png" alt="Sign Up Illustration" className="w-full h-full object-cover max-w-md" />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
              required
            />
            <button type="submit" className="w-full mt-4 p-4 bg-black text-white rounded-lg hover:bg-gray-800">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
