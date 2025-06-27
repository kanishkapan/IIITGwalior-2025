import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
      isUser: false
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the i",
      isUser: false
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to m",
      isUser: true
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the i",
      isUser: false
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and",
      isUser: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isUser: true }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
        <div className="w-8 h-8 rounded-full bg-gray-600 mr-3"></div>
        <div>
          <h1 className="text-white font-medium">My Chatbot</h1>
          <p className="text-green-400 text-sm">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-emerald-400 text-gray-900'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-800 rounded-lg">
          <input
            type="text"
            placeholder="Type your message here"
            className="flex-1 bg-transparent p-3 text-white focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 text-gray-400 hover:text-white transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;