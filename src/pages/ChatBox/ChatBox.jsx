import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";
import axios from "axios";

const ChatBox = () => {
  const { stompClient } = useWebSocket();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState({ userId: "", email: "" });
  const token = localStorage.getItem("token");

  // Lấy thông tin người dùng từ token
  useEffect(() => {
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          userId: payload.userId,
          email: payload.sub,
        };
        setCurrentUser(user || null);
        console.log("email"+ payload.sub +  "  id "+ payload.userId )
      } catch (e) {
       
        console.error("Error decoding token:", e);
      }
    } 
  }, []);

  // Tải danh sách người dùng
  const fetchUser = async (userId) => {
    try {
      console.log("current user"+ currentUser)
      const response = await fetch(
        `http://localhost:8080/chat/${userId}/list-chat`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method:"GET"
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const listUser = await response.json();
      const formattedUsers = listUser.map((user) => ({
        userId: user.userId,
        email: user.email,
        name: user.name || "Unknown",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      alert("Failed to load chatted users. Please try again.");
    }
  };

  useEffect(() => {
    if (currentUser.userId) {
      
      fetchUser(currentUser.userId, token);
    } else {
      console.warn("Cannot fetch users: Missing userId ");
    }
  }, [currentUser.userId]);

  // Cuộn đến tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lấy lịch sử trò chuyện khi chọn người dùng
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(
          `http://localhost:8080/chat/history/${currentUser.userId}/${selectedUser.userId}`
        )
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [selectedUser]);

  // Đăng ký nhận tin nhắn WebSocket
  useEffect(() => {
    if (stompClient) {
      const subscription = stompClient.subscribe(
        `/user/${currentUser.email}/chat`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      console.log("stompClient is not initialized");
    }
  }, [stompClient]);

  // Cuộn đến tin nhắn mới nhất khi danh sách tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (inputMessage.trim() && selectedUser && stompClient) {
      const messageDTO = {
        content: inputMessage,
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        timestamp: new Date().toISOString(),
      };
      console.log(messageDTO)
      stompClient.send("/app/chat", {}, JSON.stringify(messageDTO));
      setInputMessage("");
    } else {
      console.log("Cannot send message. Missing:", {
        inputMessage: !inputMessage.trim(),
        selectedUser: !selectedUser,
        stompClient: !stompClient,
      });
    }
  };

  // Xử lý nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Thanh bên trái: Danh sách người dùng */}
      <div className="w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {users.map((user) => (
            <div
              key={user.userId}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedUser?.userId === user.userId ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setSelectedUser(user);
              }}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {user.name[0]}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cửa sổ trò chuyện */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Tiêu đề cửa sổ trò chuyện */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {selectedUser.name[0]}
              </div>
              <h2 className="ml-3 text-lg font-semibold">
                {selectedUser.name}
              </h2>
            </div>

            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
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
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderEmail === currentUser.email
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập tin nhắn */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    sendMessage();
                  }}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
