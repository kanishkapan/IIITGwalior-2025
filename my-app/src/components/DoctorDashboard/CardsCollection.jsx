import React from 'react';

const Card = ({ id, name, message }) => {
  return (
    <div className="bg-gray-200 rounded-2xl p-4 flex items-start gap-4 max-w-2xl mb-4">
      {/* ID Badge */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg">
          <span className="font-mono text-lg">{id.padStart(2, '0')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="font-medium text-lg mb-2">{name}</h3>
        <p className="text-gray-700 mb-4 text-sm">{message}</p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="bg-emerald-400 text-black px-6 py-1.5 rounded hover:bg-emerald-500 transition-colors text-sm">
            Accept
          </button>
          <button className="bg-emerald-400 text-black px-6 py-1.5 rounded hover:bg-emerald-500 transition-colors text-sm">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const CardsCollection = () => {
  const cardsData = [
    {
      id: "1",
      name: "Mr.Vaibhav Mandloi",
      message: "Feeling extremely unwell with continuous vomiting and loose motions. My body feels weak, and there's a constant sense of discomfort and uneasiness. Hoping to recover soon."
    },
    {
      id: "2",
      name: "Mr.Rahul Sharma",
      message: "Experiencing severe headache and fever since yesterday. Having difficulty concentrating and maintaining balance. Need immediate medical attention."
    },
    {
      id: "3",
      name: "Mrs.Priya Patel",
      message: "Suffering from acute back pain and muscle stiffness. Unable to perform daily activities. Requesting consultation for proper diagnosis and treatment."
    },
    {
      id: "4",
      name: "Dr.Amit Kumar",
      message: "Patient reporting chest pain and shortness of breath. Vital signs show elevated blood pressure. Recommending immediate cardiovascular assessment."
    },
    {
      id: "5",
      name: "Ms.Sneha Gupta",
      message: "Dealing with persistent cough and throat infection. Experiencing difficulty in swallowing and speaking. Seeking medical advice and prescription."
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        {cardsData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            name={card.name}
            message={card.message}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsCollection;