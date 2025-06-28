import React, { useContext, useState } from "react";
import { api } from "../../axios.config.js";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { login } = useContext(UserContext);
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [extra, setExtra] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error

    const formData = { role, name, email, password, phone, dateOfBirth, gender };
    if (role === "doctor") formData.specialization = extra;

    try {
      const response = await api.post(
        "user/signup",
        formData,
        { withCredentials: true } // If needed for cookies
      );

      if (response.status === 201) {
        // You might want to automatically log the user in here
        // However, typically after signup, users are redirected to login
        // If you want to auto-login, uncomment the following lines
        // const userData = response.data;
        // login(userData);

        navigate ( "/login"); // Redirect to login page
      }
    } catch (error) {
      if (error.response) {
        console.log("Error Response Data:", error.response.data);
        console.log("Error Response Status:", error.response.status);
        console.log("Error Response Headers:", error.response.headers);
        setError(error.response.data.message || "Signup failed");
      } else if (error.request) {
        console.log("Error Request:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
      console.log("Error Config:", error.config);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-4xl w-full flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-full flex-col object-cover flex justify-center">
          <h1 className="text-6xl flex-row mb-48 text-center">Sign Up</h1>
          <img src="../src/assets/sign up page.png" alt="Sign Up Illustration" className="w-full h-full object-cover max-w-md" />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              {["student", "doctor", "admin"].map((r) => (
                <label key={r} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="form-radio text-green-500"
                  />
                  <span className="capitalize">{r}</span>
                </label>
              ))}
            </div>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
              required
            />
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
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
            />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {role === "doctor" && (
              <input
                type="text"
                placeholder="Specialization"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
                required
              />
            )}
            {error && (
              <div className="text-red-500">{error}</div>
            )}
            <button type="submit" className="w-full mt-4 p-4 bg-black text-white rounded-lg hover:bg-gray-800">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
