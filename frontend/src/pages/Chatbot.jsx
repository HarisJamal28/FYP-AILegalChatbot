import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatRef = useRef(null);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.accessToken;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Your browser does not support speech recognition.");
    }
  }, []);

  const handleMicHold = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleMicRelease = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const savedMessages = userInfo.chatMessages || [];
    setMessages(
      savedMessages.length > 0
        ? savedMessages
        : [
            {
              id: 1,
              text: "Welcome to AI Legal Chatbot!📜 What Legal Query Can I assist you with Today?",
              sender: "bot",
            },
          ]
    );
  }, []);

  useEffect(() => {
    const saveMessages = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      userInfo.chatMessages = messages;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    };
    const debounce = setTimeout(saveMessages, 300);
    return () => clearTimeout(debounce);
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
    await fetchBotResponse(input);
    setIsTyping(false);
  };

  const fetchBotResponse = async (question) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botText = "";
      let isFirstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botText += decoder.decode(value, { stream: true });

        if (isFirstChunk) {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: botText,
              sender: "bot",
            },
          ]);
          isFirstChunk = false;
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = botText;
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Sorry, something went wrong.",
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50 border border-black font-sans"
      style={{ fontFamily: "'Inria Sans'" }}
    >
      {/* Sidebar */}
      <aside className="w-full md:w-[300px] flex-shrink-0 bg-green-600 text-white flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start px-4 py-2 md:px-0 md:py-0">
        <div className="text-xl font-bold w-auto md:w-full py-2 md:py-4 px-0 md:px-4 border-b md:border-b border-green-700 whitespace-nowrap">
          <i className="fas fa-gavel mr-2" />
          <span className="hidden sm:inline">Your Legal Assistant</span>
        </div>
        <nav className="flex flex-row md:flex-col gap-2 md:gap-4 w-auto md:w-full px-0 md:px-4 py-2 md:py-4">
          <button className="w-auto md:w-full flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-full bg-green-500 hover:bg-green-700 transition text-white text-sm">
            <i className="fas fa-plus-circle" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button className="w-auto md:w-full flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-full bg-green-500 hover:bg-green-700 transition text-white text-sm">
            <i className="fas fa-history" />
            <span className="hidden sm:inline">History</span>
          </button>
        </nav>
      </aside>

      {/* Chat Area */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-300 p-3 bg-white shadow-sm flex items-center">
          <button
            onClick={handleLogout}
            className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition"
          >
            Logout
          </button>
        </header>

        {/* Messages */}
        <div
          ref={chatRef}
          className="flex-grow overflow-y-auto p-4 md:p-6 bg-white space-y-3"
        >
{messages.map(({ id, text, sender }) => (
  <div
    key={id}
    className={`w-full flex ${sender === "user" ? "justify-end" : "justify-start"}`}
  >
    <div className="relative group max-w-[85%] sm:max-w-[75%]">
      {/* Message bubble */}
      <div
        className={`px-4 py-2 text-sm break-words rounded-xl ${
          sender === "user"
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <ReactMarkdown
          components={{
            strong: ({ node, ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="list-disc ml-5" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc ml-4 mb-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-2" {...props} />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>

      {/* Floating buttons for bot messages */}
      {sender === "bot" && (
        <div className="flex justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="p-2 hover:text-gray-300 text-green-600 transition"
            title="Copy"
          >
            <i className="fas fa-copy" />
          </button>
          <button
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = "en-US";
              speechSynthesis.speak(utterance);
            }}
            className="p-2 hover:text-gray-300 text-green-600 transition"
            title="Speak"
          >
            <i className="fas fa-volume-up" />
          </button>
        </div>
      )}
    </div>
  </div>
))}




          {isTyping && (
            <div className="w-full flex justify-start">
              <div className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded-xl animate-pulse">
                ⚖️ Computing...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-gray-100 px-3 py-3 md:px-4 md:py-4 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
          <button
            aria-label="Record voice"
            onMouseDown={handleMicHold}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicHold}
            onTouchEnd={handleMicRelease}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition ${
              isRecording
                ? "bg-red-600 text-white"
                : "bg-white text-green-700 border border-green-600"
            }`}
          >
            <i className="fas fa-microphone text-lg" />
          </button>

          <button
            aria-label="Add document"
            className="p-2 md:p-3 transition group"
          >
            <i className="fas fa-paperclip text-green-700 group-hover:text-green-900 text-lg" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-grow min-w-0 rounded-lg border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2 text-sm md:text-base text-gray-700"
          />

          <button
            onClick={sendMessage}
            aria-label="Send message"
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <i className="fas fa-paper-plane rotate-45" />
          </button>
        </div>
      </main>
    </div>
  );
}
