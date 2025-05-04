import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";
import axios from "axios";
import { FaBars } from "react-icons/fa";

const ChatBox = () => {
  const { stompClient } = useWebSocket();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingStatus, setTypingStatus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState({ userId: "", email: "" });
  const token = localStorage.getItem("token");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Get current user from token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          userId: payload.userId,
          email: payload.sub,
        };
        setCurrentUser(user);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, [token]);

  // Fetch user list
  const fetchUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/chat/${userId}/list-chat`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const listUser = await response.json();
      const formattedUsers = listUser.map((user) => ({
        userId: user.userId,
        email: user.email,
        name: user.fullName || "Unknown",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      alert("Failed to load chatted users. Please try again.");
    }
  };

  useEffect(() => {
    if (currentUser.userId) {
      fetchUser(currentUser.userId);
    }
  }, [currentUser.userId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(
          `http://localhost:8080/chat/history/${currentUser.userId}/${selectedUser.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [selectedUser, currentUser.userId, token]);

  // Subscribe to messages and typing notifications
  useEffect(() => {
    if (stompClient) {
      const messageSubscription = stompClient.subscribe(
        `/user/${currentUser.email}/chat`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }
      );

      const typingSubscription = stompClient.subscribe(
        `/user/${currentUser.email}/typing`,
        (message) => {
          const typingData = JSON.parse(message.body);
          setTypingStatus((prev) => ({
            ...prev,
            [typingData.senderEmail]: typingData.isTyping,
          }));
        }
      );

      return () => {
        messageSubscription?.unsubscribe();
        typingSubscription?.unsubscribe();
      };
    }
  }, [stompClient, currentUser.email]);

  // Send typing notification
  useEffect(() => {
    if (stompClient && selectedUser && inputMessage) {
      const typingDTO = {
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        isTyping: true,
      };
      const timer = setTimeout(() => {
        stompClient.send("/app/typing", {}, JSON.stringify(typingDTO));
      }, 500);

      return () => clearTimeout(timer);
    }
    if (stompClient && selectedUser) {
      const typingDTO = {
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        isTyping: false,
      };
      stompClient.send("/app/typing", {}, JSON.stringify(typingDTO));
    }
  }, [inputMessage, stompClient, selectedUser, currentUser.email]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (inputMessage.trim() && selectedUser && stompClient) {
      const messageDTO = {
        content: inputMessage,
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      stompClient.send("/app/chat", {}, JSON.stringify(messageDTO));
      setMessages((prevMessages) => [...prevMessages, messageDTO]);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100">
      {/* Hamburger menu for mobile */}
      <button
        className="sm:hidden p-2 text-gray-600 bg-white border-b border-gray-200 fixed top-0 left-0 z-50"
        onClick={toggleSidebar}
      >
        <FaBars className="text-lg" />
      </button>

      {/* Left sidebar: User list */}
      <div
        className={`fixed sm:static top-0 left-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-40
          w-full sm:w-1/3 lg:w-1/4 max-w-[280px] sm:max-w-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg lg:text-lg font-semibold">
            Messages
          </h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)] sm:h-full">
          {users.map((user) => (
            <div
              key={user.userId}
              className={`p-3 sm:p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedUser?.userId === user.userId ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setSelectedUser(user);
                setIsSidebarOpen(false);
              }}
            >
              <div
                className="w-8 h-8 sm:w-9 h-9 lg:w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base"
              >
                {user.name[0]}
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="font-medium text-sm sm:text-base truncate">
                  {user.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col mt-10 sm:mt-0">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-2 sm:p-3 lg:p-4 bg-white border-b border-gray-200 flex items-center">
              <div
                className="w-8 h-8 sm:w-9 h-9 lg:w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base"
              >
                {selectedUser.name[0]}
              </div>
              <h2 className="ml-2 sm:ml-3 text-base sm:text-lg lg:text-lg font-semibold truncate">
                {selectedUser.name}
              </h2>
            </div>

            {/* Message display area */}
            <div className="flex-1 p-2 sm:p-3 lg:p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 sm:mb-4 flex ${
                    msg.senderEmail === currentUser.email
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] sm:max-w-xs p-2 sm:p-3 rounded-lg text-xs sm:text-sm lg:text-base ${
                      msg.senderEmail === currentUser.email
                        ? "bg-blue-500 text-white"
                        : msg.isRead
                        ? "bg-white text-gray-800 border border-gray-200"
                        : "bg-gray-200 text-gray-800 border border-gray-300 font-semibold"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {typingStatus[selectedUser.email] && (
                <div className="text-xs sm:text-sm text-gray-500">Typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-2 sm:p-3 lg:p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="ml-1 sm:ml-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs sm:text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm sm:text-base">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;