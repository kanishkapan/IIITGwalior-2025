import React from "react";

const Header = () => {
  return (
    <section className="flex justify-center px-6 lg:px-24 py-16 bg-white">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
        <h1 className="text-green-700 text-3xl lg:text-5xl font-thin mb-6 leading-snug lg:leading-tight">
        Reach Out, We’re Here to Help!
</h1>

          <p className="text-gray-700 text-lg lg:text-xl mb-8 leading-relaxed lg:leading-loose">
          Have questions or need support? Contact us anytime – we’re just a message away to assist you with Arogya Vault!
          </p>
         
        </div>

        {/* Image Placeholder */}
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <img
             src="./src/assets/contact page.png"
            alt="Healthcare Illustration"
            className="w-full max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
