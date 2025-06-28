import React from 'react';

const VideoCallCard = ({ doctorImage, decorationImage }) => {
  const handleScheduleSession = () => {
    window.location.href = "https://kani21.daily.co/TzK7Hs9DL3CdAS80lgq3"; // Replace with your actual Daily.co room link
  };
  return (
    <div className="container mx-auto p-6 max-w-5xl bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-12 p-6 bg-white shadow-lg rounded-xl">
        {/* Doctor Profile Section */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start">
          {/* Doctor Image */}
          <div className="mb-6">
            <div className="w-52 h-52 overflow-hidden rounded-xl shadow-md">
              {doctorImage ? (
                <img 
                  src="../src/assets/video call 2.png" 
                  alt="Doctor" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src="../src/assets/video call 2.png" 
                  alt="Doctor placeholder" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">MR. KAL SMITH</h2>
            <p className="text-lg font-medium text-gray-600 mb-4">BONE SPECIALIST</p>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              GRADUATED FROM ITALY SCHOOL<br />
              OF MEDICAL SCIENCE
            </p>
            <button onClick={handleScheduleSession} className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition-all shadow-md">
              See Your Doctor !
            </button>
          </div>
        </div>

        {/* Decoration Image */}
        <div className="relative w-full h-full flex-shrink-0">
          {decorationImage ? (
            <img 
              src={decorationImage} 
              alt="Decoration" 
              className="w-full h-full object-contain"
            />
          ) : (
            <img 
            src="../src/assets/form design.png" 
              alt="Decoration placeholder" 
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallCard;