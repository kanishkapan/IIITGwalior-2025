import React, { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { api } from '../../axios.config.js';

const DoctorTimeSlotSelector = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const timeSlotOptions = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // Date selection handler - moved to form submission to prevent multiple triggers
  const handleDateSelect = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const selectedDate = e.target.value;
      if (selectedDate && !selectedDates.includes(selectedDate)) {
        setSelectedDates([...selectedDates, selectedDate]);
        setTimeSlots({
          ...timeSlots,
          [selectedDate]: []
        });
        // Clear the input field after selection
        e.target.value = '';
      }
    }
  };

  // Remove a selected date
  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
    const updatedTimeSlots = { ...timeSlots };
    delete updatedTimeSlots[dateToRemove];
    setTimeSlots(updatedTimeSlots);
  };

  // Toggle time slot selection for a specific date
  const toggleTimeSlot = (date, slot) => {
    const currentSlots = timeSlots[date] || [];
    if (currentSlots.includes(slot)) {
      setTimeSlots({
        ...timeSlots,
        [date]: currentSlots.filter(s => s !== slot)
      });
    } else {
      setTimeSlots({
        ...timeSlots,
        [date]: [...currentSlots, slot]
      });
    }
  };

  // Format data for API submission
  const formatSlotsForSubmission = () => {
    const formattedSlots = [];
    Object.keys(timeSlots).forEach(date => {
      timeSlots[date].forEach(time => {
        const [timeValue, period] = time.split(' ');
        let [hours, minutes] = timeValue.split(':');
        // Convert to 24-hour format
        if (period === 'PM' && hours !== '12') {
          hours = parseInt(hours) + 12;
        } else if (period === 'AM' && hours === '12') {
          hours = '00';
        }
        const dateTime = new Date(`${date}T${hours}:${minutes}:00`);
        formattedSlots.push({
          dateTime,
          isBooked: false
        });
      });
    });
    return formattedSlots;
  };

  // Handle add date button click
  const handleAddDate = () => {
    const dateInput = document.getElementById('dateInput');
    if (dateInput && dateInput.value) {
      const selectedDate = dateInput.value;
      if (!selectedDates.includes(selectedDate)) {
        setSelectedDates([...selectedDates, selectedDate]);
        setTimeSlots({
          ...timeSlots,
          [selectedDate]: []
        });
        // Clear the input field
        dateInput.value = '';
      }
    }
  };

  // Submit time slots to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const formattedSlots = formatSlotsForSubmission();
      if (formattedSlots.length === 0) {
        setMessage({ text: 'Please select at least one time slot', type: 'error' });
        setLoading(false);
        return;
      }
      await api.patch('doctor/slots/update', { slots: formattedSlots });
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      setSelectedDates([]);
      setTimeSlots({});
    } catch (error) {
      console.error('Error updating slots:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update time slots', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-24 p-4 bg-white rounded-lg shadow relative">
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
            <div className="flex flex-col items-center">
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Success!</h3>
              <p className="text-green-700 text-center mb-4">
                Your time slots have been added successfully.
              </p>
              <button 
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700" 
                onClick={() => setShowSuccessPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-6">
        <Calendar className="mr-2 text-green-600" />
        <h2 className="text-2xl font-bold text-green-800">Add Available Time Slots</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-green-700 mb-2 font-medium">Select Date</label>
          <div className="flex space-x-2">
            <input 
              id="dateInput"
              type="date" 
              className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDate()}
              min={new Date().toISOString().split('T')[0]}
            />
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
              onClick={handleAddDate}
            >
              Add Date
            </button>
          </div>
        </div>
        
        {selectedDates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-green-700 mb-2">Selected Dates</h3>
            <div className="space-y-4">
              {selectedDates.map(date => (
                <div key={date} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-green-800">
                      {new Date(date).toLocaleDateString()}
                    </h4>
                    <button 
                      type="button" 
                      className="text-red-500 hover:text-red-700" 
                      onClick={() => handleRemoveDate(date)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {timeSlotOptions.map(slot => (
                      <button
                        key={`${date}-${slot}`}
                        type="button"
                        className={`py-2 px-3 rounded-md text-sm transition-all ease-in-out duration-200 ${
                          timeSlots[date]?.includes(slot)
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-green-700 border border-green-300 hover:bg-green-100'
                        }`}
                        onClick={() => toggleTimeSlot(date, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {message.text && message.type === 'error' && (
          <div className="p-3 rounded mb-4 bg-red-100 text-red-700 border border-red-300">
            {message.text}
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading || selectedDates.length === 0}
          >
            {loading ? 'Saving...' : 'Save Time Slots'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorTimeSlotSelector;