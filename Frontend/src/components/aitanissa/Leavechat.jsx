import React, { useState } from 'react';
import axios from 'axios';

const Leavechat = () => {
  const [studentId, setStudentId] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Make API call to the leave-related API
      const res = await axios.post('http://localhost:5000/leaverelated', {
        studentId: studentId,
        question: question
      });

      // Store the response
      setResponse(res.data);
      
      // Add to chat history
      setChatHistory([
        ...chatHistory,
        { 
          type: 'user', 
          content: question,
          studentId: studentId
        },
        { 
          type: 'ai', 
          content: res.data.answer
        }
      ]);

      // Clear question input
      setQuestion('');
    } catch (err) {
      setError('Error getting leave status. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Leave Management System</h1>
          <p className="text-sm md:text-base text-green-100">Ask questions about your leave status</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-6xl mx-auto w-full p-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden mr-0 md:mr-4 mb-4 md:mb-0">
          {/* Chat History */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-y-auto mb-4 border border-green-200">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 my-8">
                <div className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Ask a question about your leave status
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-full md:max-w-3/4 rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.type === 'user' && (
                        <div className="text-xs text-green-200 mb-1">
                          Student ID: {message.studentId}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 border border-green-200">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Student ID"
                  className="w-full sm:w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about your leave status..."
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-green-400"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Asking...
                    </span>
                  ) : 'Send'}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </div>

        {/* Response Panel */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Response Details</h2>
          
          {response ? (
            <div>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Answer:</div>
                <div className="text-gray-800">{response.answer}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Status:</div>
                <div className={`text-sm font-medium ${
                  response.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {response.status}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 my-8">
              Submit a question to see response details
            </div>
          )}
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Example questions:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>How many leave days do I have left?</li>
              <li>When was my last leave request?</li>
              <li>Are any of my leaves confirmed?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leavechat;
