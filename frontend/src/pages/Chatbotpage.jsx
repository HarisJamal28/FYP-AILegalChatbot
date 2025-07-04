import React, { useEffect, useRef, useState } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.accessToken;

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Load messages from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const savedMessages = userInfo.chatMessages || [];
    setMessages(savedMessages.length > 0 ? savedMessages : [
      { id: 1, text: "Hi! How can I help you today?", sender: "bot" },
    ]);
  }, []);

  // Save messages to localStorage whenever they change
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
  <div className="flex h-screen overflow-hidden bg-gray-50 font-sans border" style={{ fontFamily: "'Inria Sans'" }}>
    
    {/* Sidebar */}
    <aside className="w-[300px] flex-shrink-0 bg-green-600 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-green-700 whitespace-nowrap">
        <i className="fas fa-gavel mr-2" /> Your Legal Assistant
      </div>
      <nav className="flex-grow p-4 space-y-4">
        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-full bg-green-500 hover:bg-green-700 transition text-white">
          <i className="fas fa-plus-circle" /> New Chat
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-full bg-green-500 hover:bg-green-700 transition text-white">
          <i className="fas fa-history" /> History
        </button>
      </nav>
    </aside>

    {/* Main Chat Area */}
    <main className="flex flex-col flex-[1_1_0%] overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-300 p-4 bg-white shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
      </header>

      {/* Messages */}
      <div ref={chatRef} className="flex-grow overflow-y-auto p-6 bg-white space-y-3">
        {messages.map(({ id, text, sender }) => (
          <div key={id} className={`w-full flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 text-sm break-words max-w-[75%] rounded-xl ${
                sender === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="w-full flex justify-start">
            <div className="px-4 py-2 text-sm bg-gray-200 text-gray-600 rounded-xl animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gray-100 p-4 flex items-center gap-3">
        <button aria-label="Record voice" className="p-3 transition group">
          <i className="fas fa-microphone text-green-700 group-hover:text-green-900 text-lg" />
        </button>
        <button aria-label="Add document" className="p-3 transition group">
          <i className="fas fa-paperclip text-green-700 group-hover:text-green-900 text-lg" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-grow rounded-lg border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 px-4 py-2 text-gray-700"
        />
        <button
          onClick={sendMessage}
          aria-label="Send message"
          className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <i className="fas fa-paper-plane rotate-45" />
        </button>
      </div>
    </main>
  </div>
);

}
