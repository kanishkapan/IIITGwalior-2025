import React, { useState } from 'react';
import axios from 'axios';

export default function Voice() {
  const [mode, setMode] = useState('voice'); // 'voice' or 'manual'
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // For manual booking
  const [step, setStep] = useState(1);
  const [doctorName, setDoctorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Calls the voice command endpoint
  const handleVoiceCommand = async () => {
    setLoading(true);
    setStatus('Starting voice assistant…');
    try {
      const response = await axios.get('http://localhost:5000/voice-command');
      setStatus(response.data.message || 'Session ended.');
    } catch (error) {
      setStatus('Error connecting to voice assistant.');
    }
    setLoading(false);
  };

  // Handles manual booking submission.
  const handleManualSubmit = async () => {
    // For demonstration we log the input.
    // Note: Your Python endpoint currently does not accept manual input,
    // so this call is to the existing /book-appointment endpoint.
    setLoading(true);
    setStatus('Submitting your appointment…');
    try {
      // In a real scenario you’d send the collected data as POST body or query params.
      // Your backend function would need to be modified to use these values.
      const response = await axios.get('http://localhost:5000/book-appointment', {
        params: { doctor_name: doctorName, purpose, date, time },
      });
      setStatus(response.data.message || 'Appointment booked.');
    } catch (error) {
      setStatus('Error submitting appointment.');
    }
    setLoading(false);
  };

  // Render the manual form steps
  const renderManualStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="text-green-800 mb-2">Enter the Doctor's Name:</p>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full p-2 border border-green-300 rounded"
            />
            <button
              onClick={() => doctorName && setStep(2)}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="text-green-800 mb-2">Enter the Purpose of Appointment:</p>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2 border border-green-300 rounded"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded"
              >
                Back
              </button>
              <button
                onClick={() => purpose && setStep(3)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-green-800 mb-2">Enter the Appointment Date (YYYY-MM-DD):</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-green-300 rounded"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded"
              >
                Back
              </button>
              <button
                onClick={() => date && setStep(4)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-green-800 mb-2">Enter the Appointment Time (e.g., 02:30 PM):</p>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., 02:30 PM"
              className="w-full p-2 border border-green-300 rounded"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded"
              >
                Back
              </button>
              <button
                onClick={handleManualSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Appointment'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Aarogya Mitra</h1>

      {/* Mode Toggle */}
      <div className="mb-6">
        <button
          onClick={() => {
            setMode('voice');
            setStatus('');
          }}
          className={`px-4 py-2 rounded-l ${mode === 'voice' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800'}`}
        >
          Voice Assistant
        </button>
        <button
          onClick={() => {
            setMode('manual');
            setStatus('');
            setStep(1);
          }}
          className={`px-4 py-2 rounded-r ${mode === 'manual' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800'}`}
        >
          Manual Booking
        </button>
      </div>

      {mode === 'voice' ? (
        <div className="flex flex-col items-center">
          <p className="text-green-800 mb-4 text-center max-w-md">
            Use your voice to interact with Aarogya Mitra for booking appointments and applying for leave.
          </p>
          <button
            onClick={handleVoiceCommand}
            disabled={loading}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${
              loading
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? 'Listening...' : 'Start Voice Assistant'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Manual Booking</h2>
          {renderManualStep()}
        </div>
      )}

      {status && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 w-full max-w-md text-center shadow-sm">
          <p className="text-green-700 font-medium">{status}</p>
        </div>
      )}
    </div>
  );
}
