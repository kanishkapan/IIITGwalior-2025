import { useState } from "react";
import React from "react";

export default function Login() {
  const [role, setRole] = useState("student"); // Default role
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [extra, setExtra] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { role, name, email, password, phone };
    if (role === "doctor") formData.specialization = extra;

    try {
      const response = await fetch("https://your-backend-url.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-4xl w-full flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <img src="/path-to-your-image.png" alt="Login Illustration" className="w-full h-auto max-w-md" />
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
              placeholder="Your Name"
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
              placeholder="Phone Number (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
            />
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
            <button type="submit" className="w-full mt-4 p-4 bg-black text-white rounded-lg hover:bg-gray-800">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}