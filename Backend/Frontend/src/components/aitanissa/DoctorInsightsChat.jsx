import React, { useState } from "react";
import { api } from "../../axios.config.js";

const DoctorInsightsChat = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to format the response text
  const formatResponseText = (text) => {
    if (!text) return "No response received";

    try {
      if (
        typeof text === "string" &&
        (text.startsWith("{") || text.startsWith("["))
      ) {
        const jsonObj = JSON.parse(text);
        if (jsonObj.answer) {
          let formattedAnswer = jsonObj.answer
            .replace(/\\n\\n/g, "\n\n")
            .replace(/\\n/g, "\n")
            .replace(/\*/g, "")
            .replace(/\\"/g, '"');
          return formattedAnswer;
        }
        return JSON.stringify(jsonObj, null, 2);
      }
      return text.replace(/\*/g, "");
    } catch (error) {
      return text.replace(/\*/g, "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      return;
    }

    const newUserMessage = {
      id: Date.now(),
      text: question,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const res = await api.post("http://localhost:5000/doctor_insights", {
        question,
      });
      const data = res.data;

      let formattedResponse;
      if (data && data.response) {
        formattedResponse = formatResponseText(data.response);
      } else {
        formattedResponse = formatResponseText(JSON.stringify(data));
      }

      const newBotMessage = {
        id: Date.now() + 1,
        text: formattedResponse,
        sender: "bot",
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error connecting to the server: ${error.message}`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white px-3 sm:px-6 py-3 sm:py-4 shadow-xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center drop-shadow-lg">
          Doctor Insights
        </h1>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
        <div className="mx-auto space-y-3 sm:space-y-6 max-w-lg w-full">
          {messages.length === 0 ? (
            <div className="text-center text-green-600 py-6 sm:py-10">
              <p className="text-base sm:text-lg font-medium">
                Ask a question to get started
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex animate-fadeIn ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg transition-transform transform hover:scale-105 max-w-full sm:max-w-3/4 text-sm sm:text-base ${
                    message.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-800 border border-green-200"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans overflow-x-auto">
                    {message.text}
                  </pre>
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
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Question Input */}
      <footer className="bg-white px-2 sm:px-4 py-3 sm:py-4 border-t">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex space-x-2 max-w-lg w-full px-1 sm:px-2"
        >
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
            disabled={loading || !question.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default DoctorInsightsChat;
