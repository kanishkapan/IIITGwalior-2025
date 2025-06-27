import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    gender: "male",
    age: "",
    contact: "",
    medication: "",
    allergies: "",
    history: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("https://your-backend-api.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h2 className="text-5xl font-bold text-green-600 mb-8 text-center">Patient Form</h2>
      <p className="text-gray-600 text-xl mb-6">
            Let us know your allergies and medical history—so we can treat you, not your peanut butter cravings!
          </p>
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          

          <div className="flex items-center gap-6 mb-6 text-xl">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="accent-green-500 w-6 h-6"
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="accent-green-500 w-6 h-6"
              />
              Female
            </label>
          </div>

          <form className="space-y-6 text-xl" onSubmit={handleSubmit}>
            <input type="text" name="age" placeholder="Sorry to ask !" className="w-full border rounded-md p-4 text-gray-700 text-xl" onChange={handleChange} />
            <input type="text" name="contact" placeholder="What to dial to reach to u ?" className="w-full border rounded-md p-4 text-gray-700 text-xl" onChange={handleChange} />
            <input type="text" name="medication" placeholder="What doctor prescribed you currently ?" className="w-full border rounded-md p-4 text-gray-700 text-xl" onChange={handleChange} />
            <input type="text" name="allergies" placeholder="Whats that Stay Away thing ?" className="w-full border rounded-md p-4 text-gray-700 text-xl" onChange={handleChange} />
            <textarea name="history" placeholder="Let’s see how healthy u are ?" className="w-full border rounded-md p-4 text-gray-700 text-xl h-32" onChange={handleChange}></textarea>
            
            <button type="submit" className="w-full bg-black text-white py-4 rounded-md text-xl font-semibold hover:bg-gray-800">Submit</button>
          </form>
        </div>

        <div className="hidden md:block flex-1">
          <img src="https://via.placeholder.com/500" alt="Doctor Illustration" className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
};

export default Form;
