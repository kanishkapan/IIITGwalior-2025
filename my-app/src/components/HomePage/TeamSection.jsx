import React from "react";

const teamMembers = [
  {
    name: "Kanishka Pandey",
    role: "UI/UX Designer",
    experience: "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy.",
    image: "/profile-image.jpg"
  },
  {
    name: "Urvashi Marmat",
    role: "Frontend Lead",
    experience: "7+ years of experience in project management and team leadership. Strong organizational and communication skills.",
    image: "/profile-image.jpg"
  },
  {
    name: "Mufaddal Ratlamwala",
    role: "Backend Lead",
    experience: "5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization.",
    image: "/profile-image.jpg"
  },
  {
    name: "Teena Evane",
    role: "Researcher",
    experience: "3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis.",
    image: "/profile-image.jpg"
  },
  {
    name: "Arin Jain",
    role: "Frontend Dev",
    experience: "4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement.",
    image: "/profile-image.jpg"
  },
  {
    name: "Vaibhav Mandloi",
    role: "Backend Dev",
    experience: "2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries.",
    image: "/profile-image.jpg"
  }
];

const TeamSection = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 md:px-12">
      <h1 className="text-center text-2xl md:text-4xl lg:text-5xl text-green-500 font-light leading-relaxed tracking-wide">PEOPLE BEHIND DR.JIVIKA</h1>
      <p className="text-center text-gray-700 mb-8">Meet the skilled and experienced team behind our successful digital marketing strategies</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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