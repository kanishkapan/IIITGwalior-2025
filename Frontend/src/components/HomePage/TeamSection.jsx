import React from "react";

const teamMembers = [
  {
    name: "Kanishka Pandey",
    role: "UI/UX Designer",
    experience: "Winner at Hackverse 5.0 NIT Surathkal | Third Winner in Quasar 2.0| Code Rush Finalist 2023{IIT Gwalior} |",
    image: "/./src/assets/Screenshot 2025-03-11 205754.png"
  },
  {
    name: "Siya Pari",
    role: "Backend Lead",
    experience: "GNDU CSE'28 🎓 || Contributor @ GSSOC-Ext'24 || Tech enthusiast 👩‍💻",
    image: "./src/assets/WhatsApp Image 2025-04-03 at 18.05.04_2535e614.jpg"
  },
  {
    name: "Mufaddal Ratlamwala",
    role: "Backend Lead",
    experience: "Hackverse 5.0 NITK 🏆| Back-End Development | Full-Stack MERN Development | DSA | Contributor @GSSoC'24 | Core Team @GDSC",
    image: "./src/assets/Screenshot 2025-03-11 205909.png"
  },
  {
    name: "Athrav Shrotiya",
    role: "AI lead ",
    experience: "Electronics and Tech. Enthusiat || DSA || Python || Data Science || Machine Learning || Content Writer|| 4⭐⭐⭐⭐ Python HackerRank",
    image: "./src/assets/image.png"
  },

];

const TeamSection = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 md:px-12">
      <h1 className="text-center text-2xl md:text-4xl lg:text-5xl text-green-500 font-light leading-relaxed tracking-wide">PEOPLE BEHIND AROGYA VAULT </h1>
      <p className="text-center text-gray-700 mb-8">Meet the skilled and experienced team behind our successful medical app</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="relative w-full bg-white shadow-lg rounded-xl p-6 border border-gray-200 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* LinkedIn Badge on the Top Right Corner */}
            <div className="absolute top-2 right-2 bg-black text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md">
              <span className="text-green-400 text-xs font-bold">in</span>
            </div>
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
              <hr className="my-3 border-gray-300" />
              <p className="text-gray-600 text-sm">{member.experience}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;