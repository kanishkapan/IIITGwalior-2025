import React, { useState } from 'react';
import axios from 'axios';

const Predictionchat = () => {
  const [symptoms, setSymptoms] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Helper function to replace **text** with <strong>text</strong>
  const formatText = (text) => {
    if (!text) return null;
    const regex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Push text before the bolded text
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Push the bold text without the asterisks
      parts.push(<strong key={lastIndex}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    
    // Push the remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Parse symptoms into an array by splitting on commas and trimming whitespace
      const symptomsArray = symptoms
        .split(',')
        .map(symptom => symptom.trim())
        .filter(symptom => symptom !== '');

      // Make API call
      const res = await axios.post('http://localhost:5000/disease_prediction', {
        symptoms: symptomsArray
      });

      // Format and store the response
      const formattedResponse = res.data;
      setResponse(formattedResponse);
      
      // Add to chat history without studentId
      setChatHistory([
        ...chatHistory,
        { 
          type: 'user', 
          content: `Symptoms: ${symptomsArray.join(', ')}`
        },
        { 
          type: 'ai', 
          content: formattedResponse.prediction
        }
      ]);

      // Clear symptoms input
      setSymptoms('');
    } catch (err) {
      setError('Error getting prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center">
          <div className="bg-white rounded-full p-2 mr-0 sm:mr-3 mb-3 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">MediPredict AI</h1>
            <p className="text-green-100 text-sm">Advanced Disease Prediction System</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden max-w-6xl mx-auto w-full p-4">
        {/* Chat History */}
        <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto mr-0 md:mr-4 mb-4 md:mb-0">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 overflow-y-auto mb-4 border border-green-100">
            <div className="flex items-center mb-6">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <div className="text-green-800 font-semibold">Chat Session</div>
            </div>
            
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-lg font-medium text-green-800">No Predictions Yet</div>
                <p className="text-green-600 max-w-xs mt-2">
                  Enter your symptoms below to get an AI-powered disease prediction
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {chatHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-2xl p-4 shadow-md ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                          : 'bg-white border border-green-200 text-gray-800'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <div className="flex items-center mb-2">
                          <div className="bg-green-100 p-1 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div className="text-xs text-green-700 font-semibold">MediPredict AI</div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 border border-green-100">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Enter symptoms separated by commas (e.g. cough, fever, headache)"
                  className="flex-1 px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-2 px-4 rounded-xl shadow-md disabled:opacity-70 transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Predict
                    </div>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Response Panel */}
        <div className={`w-full md:w-96 bg-white rounded-2xl shadow-xl p-6 border border-green-100 overflow-y-auto transition-all duration-300 ${response ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-800">Detailed Analysis</h2>
              <p className="text-green-600 text-xs">Complete prediction results</p>
            </div>
          </div>
          
          {response ? (
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <div className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                {formatText(response.prediction)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-lg font-medium text-green-800">No Results Yet</div>
              <p className="text-green-600 max-w-xs mt-2">
                Submit your symptoms to see a detailed prediction analysis here
              </p>
            </div>
          )}

          {response && (
            <div className="mt-6 p-4 bg-green-100 rounded-xl">
              <div className="text-sm font-semibold text-green-800 mb-2">Important Notice</div>
              <p className="text-xs text-green-700">
                This prediction is for educational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment.
              </p>
            </div>
          )}
       </div>
      </div>
    </div>
  );
};

export default Predictionchat;
