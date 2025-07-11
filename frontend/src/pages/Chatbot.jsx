import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.accessToken;
  const messagesRef = useRef([]);
  

  useEffect(() => {
  messagesRef.current = messages;
}, [messages]);

const deleteChat = async (chatId) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.accessToken;

  try {
    const response = await fetch(`http://127.0.0.1:8000/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete chat");
    }

    // If successful, update the frontend state and localStorage
    const updated = chatSessions.filter((s) => s.id !== chatId);
    setChatSessions(updated);
    localStorage.setItem(`sessions_${token}`, JSON.stringify(updated));

    if (chatId === activeChatId) {
      if (updated.length > 0) {
        setMessages(updated[0].messages || []);
        setActiveChatId(updated[0].id);
      } else {
        const welcome = [
          {
            id: 1,
            text: "Welcome to AI Legal Chatbot!📜 What Legal Query Can I assist you with Today?",
            sender: "bot",
          },
        ];
        createNewChat("Chat 1", welcome);
      }
    }
  } catch (err) {
    console.error("Error deleting chat:", err.message);
    alert("Failed to delete chat. Please try again.");
  }
};

  // Load speech recognition
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
    }
  }, []);

  const handleMicHold = () => {
    recognitionRef.current?.start();
    setIsRecording(true);
  };

  const handleMicRelease = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


useEffect(() => {
  const fetchChats = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo?.accessToken;

    try {
      const response = await fetch("http://127.0.0.1:8000/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch chat history");

      const chats = await response.json();
      setChatSessions(chats);

      if (chats.length > 0) {
        // pick latest or last used
        const latest = chats[chats.length - 1];
        setActiveChatId(latest.id);
        setMessages(latest.messages || []);
      } else {
        // 🧠 DO NOT CREATE CHAT HERE! Just wait for user input or New Chat click
        setMessages([
          {
            id: 1,
            text: "Welcome to AI Legal Chatbot!📜 What Legal Query Can I assist you with Today?",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  fetchChats();
}, []);



const createNewChat = async (name, initMessages = []) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.accessToken;

  // 👇 Use welcome message if initMessages is empty
  const defaultWelcome = [
    {
      id: 1,
      text: "Welcome to AI Legal Chatbot!📜 What Legal Query Can I assist you with Today?",
      sender: "bot",
    },
  ];

  const messagesToUse = initMessages.length > 0 ? initMessages : defaultWelcome;

  const response = await fetch("http://127.0.0.1:8000/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_name: name,
      messages: messagesToUse,
    }),
  });

  const newChat = await response.json();
  const updated = [...chatSessions, newChat];
  setChatSessions(updated);
  setMessages(messagesToUse);
  setActiveChatId(newChat.id);
  return newChat;
};



  const updateChatMessages = (newMessages) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo?.accessToken;

    const updated = chatSessions.map((session) =>
      session.id === activeChatId ? { ...session, messages: newMessages } : session
    );

    setChatSessions(updated);
    localStorage.setItem(`sessions_${token}`, JSON.stringify(updated));
  };

const sendMessage = async () => {
  if (input.trim() === "") return;

  const newMessage = {
    id: Date.now(),
    text: input,
    sender: "user",
  };

  let updatedMessages = [...messages, newMessage];

  setMessages(updatedMessages);
  setInput("");
  setIsTyping(true);

  // 🧠 Create new chat on first message only if no active chat
  if (!activeChatId) {
    const name = `Chat - ${new Date().toLocaleString()}`;
    const newChat = await createNewChat(name, updatedMessages);
    setActiveChatId(newChat.id); // backend ID
  } else {
    updateChatMessages(updatedMessages); // just update local state
  }

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
      body: JSON.stringify({
        question,
        chat_id: activeChatId,  // 🔁 ✅ Include chat_id here
      }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let botText = "";
    let isFirstChunk = true;
    let tempMessages = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      botText += decoder.decode(value, { stream: true });

      if (isFirstChunk) {
        const currentMessages = [...messagesRef.current];
        tempMessages = [
          ...currentMessages,
          { id: currentMessages.length + 1, text: botText, sender: "bot" },
        ];
        setMessages(tempMessages);
        isFirstChunk = false;
      } else {
        tempMessages[tempMessages.length - 1].text = botText;
        setMessages([...tempMessages]);
      }
    }

    updateChatMessages(tempMessages); // 🔁 Save final chat messages locally
  } catch (err) {
    console.error("Error:", err);
    const errorMessage = {
      id: messages.length + 1,
      text: "Sorry, something went wrong.",
      sender: "bot",
    };
    const updated = [...messages, errorMessage];
    setMessages(updated);
    updateChatMessages(updated);
  }
};



const switchChat = (chatId) => {
  const selectedChat = chatSessions.find((c) => c.id === chatId);
  if (selectedChat) {
    setActiveChatId(chatId);
    setMessages(selectedChat.messages || []);
  }
};


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50 border border-black font-sans">
      {/* Sidebar */}
<aside className={`
  bg-green-600 text-white flex flex-col fixed md:static z-50 h-full md:h-auto
  top-0 left-0 transition-transform transform md:translate-x-0
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  w-4/5 max-w-[320px] md:w-[300px] px-4 py-2 md:px-0 md:py-0
`}>
  <div className="flex justify-between items-center md:block py-4 px-4 border-b border-green-700">
    <div className="text-l font-bold whitespace-nowrap">
      <i className="fas fa-gavel mr-2" />
      Your Legal Assistant
    </div>
    <button
      className="md:hidden text-white text-xl"
      onClick={() => setSidebarOpen(false)}
    >
      <i className="fas fa-times" />
    </button>
  </div>

  <nav className="flex flex-col gap-4 w-full px-4 py-4 overflow-y-auto">
    <button
      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-700 text-white text-sm"
      onClick={() => createNewChat()}
    >
      <i className="fas fa-plus-circle" />
      <span>New Chat</span>
    </button>

{chatSessions.map((chat) => (
  <div
    key={chat.id}
    className={`flex justify-between items-center px-3 py-2 rounded-lg ${
      chat.id === activeChatId
        ? "bg-green-700"
        : "bg-green-500 hover:bg-green-600"
    }`}
  >
    <div
      className="flex flex-col flex-grow cursor-pointer"
      onClick={() => switchChat(chat.id)}
    >
      <div className="font-semibold">{chat.name}</div>
      <div className="text-xs opacity-75">
        {new Date(chat.timestamp).toLocaleString()}
      </div>
    </div>
<button
  onClick={() => deleteChat(chat.id)}
  className="ml-2 text-white hover:text-red-300 transition"
  title="Delete Chat"
>
  <i className="fas fa-trash-alt" />
</button>
  </div>
))}



  </nav>
</aside>

{/* Backdrop for overlay */}
{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
    onClick={() => setSidebarOpen(false)}
  ></div>
)}

      {/* Chat Area */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
<header className="border-b border-gray-300 p-3 bg-white shadow-sm flex items-center justify-between">
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="md:hidden text-green-700 text-xl"
  >
    <i className="fas fa-bars" />
  </button>

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
