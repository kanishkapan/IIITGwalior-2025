import React, { useState } from 'react';

const DoctorInsightsChat = () => {
  const [doctorId, setDoctorId] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!doctorId.trim() || !question.trim()) {
      return;
    }
    
    const newUserMessage = {
      id: Date.now(),
      text: question,
      sender: 'user'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:3053/doctor_insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId,
          question
        }),
      });
      
      const data = await response.json();
      
      // Process the response to remove ** markers
      const formattedResponse = data.response ? data.response.replace(/\*\*/g, '') : 'No response received';
      
      const newBotMessage = {
        id: Date.now() + 1,
        text: formattedResponse,
        sender: 'bot'
      };
      
      setMessages((prev) => [...prev, newBotMessage]);
      setQuestion('');
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error connecting to the server. Please try again.',
        sender: 'bot'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 text-white px-4 py-3 shadow-md sm:px-6 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center">Doctor Insights</h1>
      </header>
      
      {/* Doctor ID Input */}
      <section className="bg-white px-4 py-3 shadow-sm border-b sm:px-6">
        <div className="mx-auto max-w-full sm:max-w-2xl">
          <label htmlFor="doctorId" className="block text-sm font-medium text-green-700 mb-1">
            Doctor ID
          </label>
          <input
            type="text"
            id="doctorId"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            placeholder="Enter your doctor ID"
          />
        </div>
      </section>
      
      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto space-y-4 max-w-full sm:max-w-2xl">
          {messages.length === 0 ? (
            <div className="text-center text-green-500 py-8">
              Ask a question to get started
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex animate-fadeIn ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 shadow-md transition transform hover:scale-105 max-w-[90%] sm:max-w-md ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-800 border border-green-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white text-green-800 rounded-lg px-4 py-2 shadow-md max-w-[90%] sm:max-w-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Question Input */}
      <footer className="bg-white px-4 py-3 border-t sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto flex space-x-2 max-w-full sm:max-w-2xl">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            placeholder="Ask a question..."
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 disabled:bg-green-400"
            disabled={loading || !doctorId.trim() || !question.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default DoctorInsightsChat;
