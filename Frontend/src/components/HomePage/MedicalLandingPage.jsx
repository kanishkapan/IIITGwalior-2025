import React from 'react';

const MedicalLandingPage = () => {
  return (
    <div className="font-sans">
      {/* Header */}
   
      {/* Hero Section */}
      <div className="relative w-screen h-[85vh] sm:h-[90vh] lg:h-screen overflow-hidden" 
         style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="../src/assets/video_preview_h264.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent"></div>

      <div className="relative flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 text-white">
        <div className="text-sm text-gray-300 mb-4">
          <span className="hover:text-gray-100 cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span>Contact</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Meet Jivika: Bridging Timeless <br/> Ayurveda with Modern Innovation, Naturally.
        </h1>

        <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl">
        जीविका: योगः, आयुर्वेदः, विज्ञानस्य संगमः।
        </p>

        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
            Start Your Health Journey
          </button>
        </div>
      </div>
    </div>

      {/* Appointment Section */}
      <section className="bg-white py-8 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-center bg-blue-100 p-6 rounded-lg shadow-md">
          <div>
            <p className="font-bold text-xl text-blue-700">Book an Appointment</p>
            <p className="text-gray-600">Convenient booking</p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-blue-100 p-6 rounded-lg shadow-md">
          <div>
            <p className="font-bold text-xl text-blue-700">Meet Our Doctors</p>
            <p className="text-gray-600">Get expert advice</p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-blue-100 p-6 rounded-lg shadow-md">
          <div>
            <p className="font-bold text-xl text-blue-700">Healthcare Services</p>
            <p className="text-gray-600">Accessible care</p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
     
    </div>
  );
};

export default MedicalLandingPage;
