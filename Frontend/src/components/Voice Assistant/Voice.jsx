import React, { useState } from 'react';
import { Mic, MicOff, Calendar, Clock, User, FileText, Send } from 'lucide-react';

const Voice = () => {
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState('initial'); // initial, doctor, leave
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! Would you like to book a doctor appointment or apply for leave?' }
  ]);
  const [userInput, setUserInput] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages([...messages, { sender: 'user', text: userInput }]);
    
    // Process input and determine response
    let aiResponse = '';
    
    if (mode === 'initial') {
      if (userInput.toLowerCase().includes('doctor') || userInput.toLowerCase().includes('appointment')) {
        setMode('doctor');
        aiResponse = "Let's book your doctor appointment. What's the doctor's name?";
      } else if (userInput.toLowerCase().includes('leave')) {
        setMode('leave');
        aiResponse = "I'll help you apply for leave. How many days do you need off?";
      } else {
        aiResponse = "I didn't catch that. Would you like to book a doctor appointment or apply for leave?";
      }
    } else if (mode === 'doctor') {
      // Simple state management for doctor booking flow
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.text.includes("doctor's name")) {
        aiResponse = "When would you like to schedule this appointment?";
      } else if (lastMessage.text.includes("schedule this appointment")) {
        aiResponse = "What's the reason for your visit?";
      } else if (lastMessage.text.includes("reason for your visit")) {
        aiResponse = "Great! I've scheduled your appointment. Anything else you need?";
        setMode('initial');
      }
    } else if (mode === 'leave') {
      // Simple state management for leave application flow
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.text.includes("how many days")) {
        aiResponse = "What dates will you be away?";
      } else if (lastMessage.text.includes("dates")) {
        aiResponse = "What's the reason for your leave?";
      } else if (lastMessage.text.includes("reason for your leave")) {
        aiResponse = "Your leave request has been submitted. Is there anything else I can help with?";
        setMode('initial');
      }
    }
    
    // Add AI response with a small delay to simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 500);
    
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-green-600 p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-700">AI ASSISTANT</h1>
        <div className="bg-green-100 px-3 py-1 rounded-full border border-green-300">
          <span className="text-sm font-medium text-green-700">ONLINE</span>
        </div>
      </div>
      
      {/* Mode Selection */}
      <div className="flex mb-6 space-x-4">
        <button 
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all ${
            mode === 'doctor' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-green-700 border-2 border-green-500 hover:bg-green-50'
          }`}
          onClick={() => {
            setMode('doctor');
            setMessages([...messages, { sender: 'ai', text: "Let's book your doctor appointment. What's the doctor's name?" }]);
          }}
        >
          <Calendar size={18} />
          <span>Book Appointment</span>
        </button>
        
        <button 
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all ${
            mode === 'leave' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-green-700 border-2 border-green-500 hover:bg-green-50'
          }`}
          onClick={() => {
            setMode('leave');
            setMessages([...messages, { sender: 'ai', text: "I'll help you apply for leave. How many days do you need off?" }]);
          }}
        >
          <FileText size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>
      
      {/* Chat Display */}
      <div className="flex-1 overflow-auto mb-4 p-4 bg-green-50 rounded-lg border border-green-200 shadow-lg">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg shadow ${
                  message.sender === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-green-800 rounded-bl-none border-l-4 border-green-500'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg border border-green-200 shadow-lg">
        <button 
          className={`p-3 rounded-full shadow-md ${
            isListening 
              ? 'bg-green-600 text-white animate-pulse' 
              : 'bg-white text-green-700 border-2 border-green-500 hover:bg-green-50'
          }`}
          onClick={toggleListening}
        >
          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-white text-green-800 p-3 rounded-lg border-2 border-green-300 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
          placeholder={isListening ? "Listening..." : "Type your message..."}
        />
        
        <button 
          className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md"
          onClick={handleSendMessage}
        >
          <Send size={22} />
        </button>
      </div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-xs text-green-600 font-medium">
        <div>MODE: {mode.toUpperCase()}</div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>SYSTEM READY</span>
        </div>
      </div>
    </div>
  );
};

export default Voice;