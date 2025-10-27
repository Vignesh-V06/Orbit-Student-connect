import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ Load old messages + listen for new ones
  useEffect(() => {
    socket.on("loadMessages", (msgs) => {
      const sorted = [...msgs].sort((a, b) => a.timestamp - b.timestamp);
      setChat(sorted);
    });


    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, []);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ✅ Send message
  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = { name: username, text: message };
    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  // ✅ Handle login
  const handleLogin = () => {
    if (username.trim()) setIsLoggedIn(true);
  };

  return (
    <div className="main">
      {!isLoggedIn ? (
        <div className="login-card">
          <h1>🚀 Orbit Lite</h1>
          <p>VIT Student Collaboration Chat</p>
          <input
            type="text"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Join Chat</button>
        </div>
      ) : (
        <div className="chat-layout">
          <header className="chat-header">
            <div className="logo-container">
              <img src="/orbit_white.png" alt="Orbit Lite Logo" className="chat-logo" />
            </div>
            <div className="user-tag">👤 {username}</div>
          </header>


          <div className="chat-body">
            {chat.length === 0 && (
              <div className="empty-msg">Start the conversation 💬</div>
            )}
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`msg-bubble ${msg.name === username ? "self" : "other"
                  }`}
              >
                {msg.name !== username && (
                  <span className="msg-name">{msg.name}</span>
                )}
                <p className="msg-text">{msg.text}</p>
                <span className="msg-time">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""}
                </span>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <footer className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
