import React from "react";

const Header = () => {
  return (
    <section className="flex justify-center px-6 lg:px-24 py-16 bg-white">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
        <h1 className="text-green-700 text-3xl lg:text-5xl font-thin mb-6 leading-snug lg:leading-tight">
  MEET JIVIKA: YOUR <br /> 24/7 HEALTH COMPANION
</h1>

          <p className="text-gray-700 text-lg lg:text-xl mb-8 leading-relaxed lg:leading-loose">
            EXPERIENCE HEALTHCARE REIMAGINED WITH AI-POWERED SUPPORT. <br />
            FROM ROUTINE CHECKUPS TO URGENT CARE GUIDANCE, <br />
            JIVIKA IS ALWAYS HERE FOR YOU.
          </p>
          <button className="bg-green-300 text-green-900 px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition duration-300">
            Start Your Journey
          </button>
        </div>

        {/* Image Placeholder */}
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <img
            src="./src/assets/image 35.png"
            alt="Healthcare Illustration"
            className="w-full max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
