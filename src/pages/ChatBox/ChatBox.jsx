import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";
import axios from "axios";
import { FaBars, FaSearch } from "react-icons/fa";

const ChatBox = () => {
  const { stompClient } = useWebSocket();
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typingStatus, setTypingStatus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState({ userId: "", email: "" });
  const token = localStorage.getItem("token");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/chat/search?query=${encodeURIComponent(query)}¤tUserId=${currentUser.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const formattedUsers = response.data.map((user) => ({
        userId: user.userId,
        email: user.email,
        name: user.fullName || "Unknown",
      }));
      setSearchedUsers(formattedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      alert("Failed to search users. Please try again.");
    }
  };

  useEffect(() => {
    if (currentUser.userId) {
      fetchUser(currentUser.userId);
    }
  }, [currentUser.userId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentUser.userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    if (stompClient) {
      const messageSubscription = stompClient.subscribe(
        `/user/${currentUser.email}/chat`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => {
            if (
              prevMessages.some(
                (msg) =>
                  msg.content === receivedMessage.content &&
                  msg.timestamp === receivedMessage.timestamp &&
                  msg.senderEmail === receivedMessage.senderEmail
              )
            ) {
              return prevMessages;
            }
            return [...prevMessages, receivedMessage];
          });
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
      if (!users.some((user) => user.userId === selectedUser.userId)) {
        setUsers((prev) => [...prev, selectedUser]);
      }
      setInputMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex h-[calc(100vh-48px)] max-w-7xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
    {/* Hamburger menu for mobile */}
    <button
      className="sm:hidden p-3 text-gray-600 bg-white fixed top-4 left-4 z-50 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
      onClick={toggleSidebar}
    >
      <FaBars className="text-lg" />
    </button>

    {/* Left sidebar: User list */}
    <div
      className={`fixed sm:static top-0 left-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-40
        w-80 sm:w-1/3 lg:w-1/4 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        <div className="mt-3 flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 shadow-sm">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="flex-1 bg-transparent outline-none text-sm focus:ring-0"
          />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-120px)]">
        {(searchQuery ? searchedUsers : users).map((user) => (
          <div
            key={user.userId}
            className={`p-4 flex items-center cursor-pointer hover:bg-teal-50 transition-colors duration-300 ${
              selectedUser?.userId === user.userId ? "bg-teal-100" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              setIsSidebarOpen(false);
            }}
          >
            <div
              className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-base shadow-sm"
            >
              {user.name[0]}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Chat window */}
    <div className="flex-1 flex flex-col bg-white">
      {selectedUser ? (
        <>
          {/* Chat header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <div
              className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-base shadow-sm"
            >
              {selectedUser.name[0]}
            </div>
            <h2 className="ml-3 text-lg font-semibold text-gray-800 truncate">
              {selectedUser.name}
            </h2>
          </div>

          {/* Message display area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.senderEmail === currentUser.email
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] sm:max-w-md p-3 rounded-lg text-sm shadow-sm transition-all duration-200 ${
                    msg.senderEmail === currentUser.email
                      ? "bg-teal-500 text-white"
                      : msg.isRead
                      ? "bg-white text-gray-800 border border-gray-200"
                      : "bg-gray-100 text-gray-800 border border-gray-300 font-semibold"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {typingStatus[selectedUser.email] && (
              <div className="text-xs text-gray-500 animate-pulse">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-base">
            Select a user to start chatting
          </p>
        </div>
      )}
    </div>
  </div>
  );
};

export default ChatBox;