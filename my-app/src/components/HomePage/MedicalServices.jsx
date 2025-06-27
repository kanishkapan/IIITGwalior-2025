import React from 'react';
import { useNavigate } from 'react-router-dom';

const MedicalServices = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      title: 'Appointment Booking',
      buttonText: 'Appointment Booking',
      route: '/appointment',
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 mb-3">
          <path
            fill="currentColor"
            d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"
          />
        </svg>
      ),
    },
    {
      title: 'Telemedicine Support',
      buttonText: 'Telemedicine Support',
      route: '/telemedicine',
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 mb-3">
          <path
            fill="currentColor"
            d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12z"
          />
        </svg>
      ),
    },
    {
      title: 'Video Calling Feature',
      buttonText: 'Video Calling Feature',
      route: '/video-call',
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 mb-3">
          <path
            fill="currentColor"
            d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
          />
        </svg>
      ),
    },
    {
      title: 'Medical Centers On Maps',
      buttonText: 'Medical Centers On Maps',
      route: '/medical-centers',
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 mb-3">
          <path
            fill="currentColor"
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          />
        </svg>
      ),
    },
    {
      title: 'AI-Diagnosis',
      buttonText: 'AI-Diagnosis',
      route: '/ai-diagnosis',
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 mb-3">
          <path
            fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
            >
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                {service.icon}
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 text-center">
                {service.title}
              </h3>
              <button 
                onClick={() => navigate(service.route)}
                className="mt-4 bg-green-300 text-green-900 px-4 py-2 rounded-lg font-bold hover:bg-green-400 w-full"
              >
                {service.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalServices;
