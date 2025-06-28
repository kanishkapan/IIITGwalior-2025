import React, { useState } from 'react';

const DoctorInsightsChat = () => {
  const [doctorId, setDoctorId] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to format the response text
  const formatResponseText = (text) => {
    if (!text) return 'No response received';
    
    try {
      // Check if it's a JSON string
      if (typeof text === 'string' && (text.startsWith('{') || text.startsWith('['))) {
        // Parse JSON
        const jsonObj = JSON.parse(text);
        
        // If it has an answer property, format that nicely
        if (jsonObj.answer) {
          // Replace newline indicators with actual newlines
          let formattedAnswer = jsonObj.answer
            .replace(/\\n\\n/g, '\n\n')  // Double newlines
            .replace(/\\n/g, '\n')       // Single newlines
            .replace(/\*/g, '')          // Remove asterisks
            .replace(/\\"/g, '"');       // Fix escaped quotes
            
          return formattedAnswer;
        }
        
        // If no answer property, return the formatted JSON
        return JSON.stringify(jsonObj, null, 2);
      }
      
      // If not JSON, just remove asterisks
      return text.replace(/\*/g, '');
    } catch (error) {
      // If JSON parsing fails, just return the original text without asterisks
      return text.replace(/\*/g, '');
    }
  };

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId,
          question
        })
      });

      const data = await response.json();

      let formattedResponse;
      
      if (data && data.response) {
        formattedResponse = formatResponseText(data.response);
      } else {
        formattedResponse = formatResponseText(JSON.stringify(data));
      }

      const newBotMessage = {
        id: Date.now() + 1,
        text: formattedResponse,
        sender: 'bot'
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setQuestion('');
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error connecting to the server: ${error.message}`,
        sender: 'bot'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      {/* Header - Responsive font sizes */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white px-3 sm:px-6 py-3 sm:py-4 shadow-xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center drop-shadow-lg">Doctor Insights</h1>
      </header>

      {/* Doctor ID Input - Responsive padding */}
      <section className="bg-white px-3 sm:px-6 py-3 sm:py-4 shadow-md border-b">
        <div className="mx-auto max-w-lg w-full px-2 sm:px-4">
          <label htmlFor="doctorId" className="block text-xs sm:text-sm font-semibold text-green-700 mb-1 sm:mb-2">
            Doctor ID
          </label>
          <input
            type="text"
            id="doctorId"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-sm sm:text-base"
            placeholder="Enter your doctor ID"
          />
        </div>
      </section>

      {/* Chat Messages - Responsive spacing and sizing */}
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
        <div className="mx-auto space-y-3 sm:space-y-6 max-w-lg w-full">
          {messages.length === 0 ? (
            <div className="text-center text-green-600 py-6 sm:py-10">
              <p className="text-base sm:text-lg font-medium">Ask a question to get started</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex animate-fadeIn ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg transition-transform transform hover:scale-105 max-w-full sm:max-w-3/4 text-sm sm:text-base ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-800 border border-green-200'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans overflow-x-auto">{message.text}</pre>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white text-green-800 rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg max-w-full">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Question Input - Responsive spacing and button size */}
      <footer className="bg-white px-2 sm:px-4 py-3 sm:py-4 border-t">
        <form onSubmit={handleSubmit} className="mx-auto flex space-x-2 max-w-lg w-full px-1 sm:px-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-sm sm:text-base"
            placeholder="Ask a question..."
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 disabled:bg-green-400 text-sm sm:text-base"
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