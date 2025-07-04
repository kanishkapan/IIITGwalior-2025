import React from "react";

const HeroSection = () => {
  return (
    <section className="flex justify-center px-6 lg:px-24 py-16 bg-white">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
        <h1 className="text-green-700 text-3xl lg:text-5xl font-thin mb-6 leading-snug lg:leading-tight">
        Effortless Student Healthcare Management – Securely Store, Access & Manage Medical Records with Arogya Vault.
</h1>

          <p className="text-gray-700 text-lg lg:text-xl mb-8 leading-relaxed lg:leading-loose">
          Your Health, Your Vault – Instantly access, manage, and secure student medical records with ease.
          </p>
          
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

export default HeroSection;
