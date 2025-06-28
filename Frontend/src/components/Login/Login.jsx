import React, { useContext, useState } from "react";
import { api } from "../../axios.config.js";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error

    try {
      const response = await api.post(
        "/user/login",
        { email, password },
        { withCredentials: true } // Important for cookies to be stored
      );
      console.log(response);
      if (response.status === 200) {
        const { role, userData,token } = response.data;
        login(userData); // Update user context
        
        if (token) {
          localStorage.setItem("token", token);  // ✅ Store token manually
        }
        localStorage.setItem("userId", userData.id);
        console.log("User ID from localStorage:", localStorage.getItem("userId"));

        
        if (role === "doctor") {
          navigate ( "/doctor");  
        } else if (role === "student") {
          navigate("/profile");
        }
        else {
          navigate("/admin");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password");
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
            {error && (
              <div className="text-red-500">{error}</div>
            )}
            <button type="submit" className="w-full mt-4 p-4 bg-black text-white rounded-lg hover:bg-gray-800">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
