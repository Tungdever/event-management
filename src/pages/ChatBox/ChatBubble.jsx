import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";
import axios from "axios";

const ChatBubble = ({ currentUser }) => {
  const { stompClient } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingStatus, setTypingStatus] = useState({});
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch user list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/chat/${currentUser.userId}/list-chat`,
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
          name: user.name || "Unknown",
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Failed to load chatted users:", error);
      }
    };
    if (currentUser.userId) fetchUsers();
  }, [currentUser.userId, token]);

  // Subscribe to messages and typing notifications
  useEffect(() => {
    if (stompClient && currentUser.email) {
      const messageSubscription = stompClient.subscribe(
        `/user/${currentUser.email}/chat`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          // Thêm tin nhắn nếu nó thuộc cuộc trò chuyện hiện tại
          if (
            selectedUser &&
            (receivedMessage.senderEmail === selectedUser.email ||
              receivedMessage.recipientEmail === selectedUser.email)
          ) {
            setMessages((prev) => {
              // Tránh trùng lặp tin nhắn
              if (
                prev.some(
                  (msg) =>
                    msg.content === receivedMessage.content &&
                    msg.timestamp === receivedMessage.timestamp &&
                    msg.senderEmail === receivedMessage.senderEmail
                )
              ) {
                return prev;
              }
              return [...prev, receivedMessage];
            });
          }
          // Cập nhật số tin nhắn chưa đọc
          if (
            !isOpen ||
            (selectedUser?.email !== receivedMessage.senderEmail &&
              receivedMessage.senderEmail !== currentUser.email)
          ) {
            setUnreadCounts((prev) => ({
              ...prev,
              [receivedMessage.senderEmail]:
                (prev[receivedMessage.senderEmail] || 0) + 1,
            }));
          }
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
  }, [stompClient, currentUser.email, selectedUser, isOpen]);

  // Fetch chat history when selecting a user
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
          setUnreadCounts((prev) => ({
            ...prev,
            [selectedUser.email]: 0,
          }));
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [selectedUser, currentUser.userId, token]);

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

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
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
      // Thêm tin nhắn vào state ngay lập tức
      setMessages((prev) => [...prev, messageDTO]);
      // Gửi tin nhắn qua WebSocket
      stompClient.send("/app/chat", {}, JSON.stringify(messageDTO));
      setInputMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {Object.values(unreadCounts).reduce((a, b) => a + b, 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
      )}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="p-4 bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Messages</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {!selectedUser ? (
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="p-3 flex items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {user.name[0]}
                  </div>
                  <div className="ml-2 flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  {unreadCounts[user.email] > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCounts[user.email]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="p-3 bg-gray-100 flex items-center">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-blue-500 mr-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {selectedUser.name[0]}
                </div>
                <p className="ml-2 font-medium">{selectedUser.name}</p>
              </div>
              <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 flex ${
                      msg.senderEmail === currentUser.email
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        msg.senderEmail === currentUser.email
                          ? "bg-blue-500 text-white"
                          : msg.isRead
                          ? "bg-white text-gray-800 border border-gray-200"
                          : "bg-gray-200 text-gray-800 border border-gray-300 font-semibold"
                      }`}
                    >
                      <p>{msg.content || "(empty)"}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {typingStatus[selectedUser.email] && (
                  <div className="text-sm text-gray-500">Typing...</div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;