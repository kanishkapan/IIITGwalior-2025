import React, { useState } from 'react';
import { api } from "../../axios.config.js";

const Healthchat = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { question };
      const res = await api.post('http://localhost:5000/ask_question', payload);
      const data = res.data;
      
      setResponse(data);
      
      // Update chat history
      setChatHistory(prev => [
        ...prev,
        {
          type: 'question',
          content: question,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          type: 'answer',
          content: data.answer,
          status: data.status,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      
      // Clear question input
      setQuestion('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponse({ answer: 'Error connecting to the server', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Function to render attachments as links
  const renderText = (text) => {
    if (!text) return null;
    
    const linkRegex = /\(https:\/\/[^)]+\)/g;
    const parts = text.split(linkRegex);
    const matches = text.match(linkRegex) || [];
    
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
        {matches[index] && (
          <a 
            href={matches[index].substring(1, matches[index].length - 1)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 underline font-semibold hover:text-emerald-800 transition-colors"
          >
            View Attachment
          </a>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h1 className="text-2xl font-bold">Health Record Assistant</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Chat container */}
        <div className="flex flex-col flex-1 p-4">
          {/* Chat history */}
          <div className="flex-1 overflow-y-auto mb-6 bg-white rounded-lg shadow-md">
            <div className="p-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                  <svg className="h-16 w-16 text-emerald-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-lg font-medium">No conversation history yet.</p>
                  <p className="text-sm text-gray-400">Start by asking a question about your health records.</p>
                </div>
              ) : (
                chatHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className={`${item.type === 'question' ? 'bg-emerald-100 ml-12 border-l-4 border-emerald-500' : 'bg-white mr-12 border border-gray-200 shadow-sm'} p-4 rounded-lg`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${item.type === 'question' ? 'text-emerald-800' : 'text-gray-800'}`}>
                        {item.type === 'question' ? 'You' : 'Health Assistant'}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.timestamp}</span>
                    </div>
                    <div className={`${item.type === 'answer' ? 'whitespace-pre-line text-gray-700' : 'text-gray-800'}`}>
                      {item.type === 'answer' ? renderText(item.content) : item.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="bg-white p-4 rounded-lg mr-12 border border-gray-200 shadow-sm">
                  <div className="flex space-x-2 justify-center items-center">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Question input */}
          <form onSubmit={handleSubmit} className="flex items-center bg-white p-2 rounded-lg shadow-md">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your health records..."
              className="flex-1 p-3 border-none focus:outline-none focus:ring-0"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-green-500 text-white p-3 rounded-lg hover:from-emerald-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-2"
              disabled={loading || !question}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </span>
              )}
            </button>
          </form>
        </div>
        
        {/* Information sidebar */}
        <div className="hidden lg:block w-80 bg-white m-4 p-6 rounded-lg shadow-md border-t-4 border-emerald-500">
          <h2 className="font-bold text-xl mb-4 text-emerald-800 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Information
          </h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>Use this interface to query your health records securely.</p>
            <p>Ask specific questions about your health records.</p>
            
            <div className="bg-emerald-50 p-3 rounded-lg border-l-2 border-emerald-400 mt-4">
              <p className="font-medium text-emerald-800 mb-2">Example questions:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Give me details about all my health records</li>
                <li>What was my last diagnosis?</li>
                <li>Show me my prescriptions</li>
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Security Notice</span>
              </div>
              <p className="text-xs text-gray-500">All data is handled securely and protected under HIPAA regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Healthchat;
