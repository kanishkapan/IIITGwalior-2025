import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Gemini API key and endpoint details
const GEMINI_API_KEY = "AIzaSyAjQ11QPsCGxn8JnK9VjPV_CrrZ927BOAk";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export default function MedicalAIChat() {
  const [conversation, setConversation] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Prepend a context that instructs the AI to act as a doctor (with disclaimer)
  const getDoctorPrompt = (userQuestion) => {
    return `
You are a knowledgeable and compassionate licensed medical professional. 
Answer the following medical question as best you can, but always include a disclaimer 
that your response is for informational purposes only and should not replace professional medical advice.
Medical question: ${userQuestion}
    `;
  };

  const formatResponse = (text) => {
    return text.replace(/\*/g, ""); // Removes asterisks from AI response
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    // Append user's message to the conversation
    const updatedConversation = [
      ...conversation,
      { role: "user", text: query }
    ];
    setConversation(updatedConversation);
    setQuery("");
    setLoading(true);
    setError("");

    try {
      // Use the enhanced prompt
      const prompt = getDoctorPrompt(query);

      const res = await axios.post(API_URL, {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      });

      // Extract the AI's response from the API payload and format it
      const responseText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI";

      setConversation(prev => [
        ...prev,
        { role: "ai", text: formatResponse(responseText) }
      ]);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(
        "Error fetching response: " +
          (err.response?.data?.error?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  const handleClear = () => {
    setConversation([]);
    setError("");
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <header className="bg-green-600 text-white py-4 text-center font-bold text-2xl">
        Medical AI Chatbot
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-md ${
                msg.role === "user" ? "bg-green-300" : "bg-green-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-green-200">
        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a medical question..."
            className="flex-grow p-3 border-2 border-green-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 font-bold rounded-r-lg transition duration-300 ease-in-out disabled:bg-green-400"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <div className="mt-2 text-right">
          <button
            onClick={handleClear}
            className="text-sm text-green-600 hover:underline"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}