import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatBox = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // Lấy thông tin người dùng từ token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserEmail(payload.sub || null);
        setCurrentUserId(payload.userId || null);
      } catch (e) {
        setError("Invalid token");
        console.error("Error decoding token:", e);
      }
    } else {
      setError("Please log in to use chat");
    }
  }, []);

  // Tải danh sách người dùng
  useEffect(() => {
    if (currentUserEmail && currentUserId) {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = [
            { id: 1, email: "trung123@gmail.com", name: "trung123@gmail.com", status: "Online" },
            { id: 2, email: "trungho.234416@gmail.com", name: "trungho.234416@gmail.com", status: "Offline" },
          ];
          // Loại trừ người dùng hiện tại
          const filteredUsers = response.filter(
            (user) => user.id !== currentUserId
          );
          setUsers(filteredUsers);
          setSelectedUser(filteredUsers[0] || null);
        } catch (error) {
          setError("Error fetching users");
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [currentUserEmail, currentUserId]);

  // Kết nối WebSocket
  useEffect(() => {
    if (currentUserEmail) {
      const socket = new SockJS("http://localhost:8080/chat");
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log("Connected to WebSocket");
        setStompClient(client);
        client.subscribe(`/user/queue/private`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });
      };

      client.onStompError = (frame) => {
        setError("WebSocket connection failed");
        console.error("STOMP error:", frame);
      };

      client.activate();

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    }
  }, [currentUserEmail]);

  // Tải lịch sử chat khi chọn người dùng
  useEffect(() => {
    if (stompClient && selectedUser && currentUserEmail && stompClient.connected) {
      setMessages([]);
      stompClient.publish({
        destination: "/app/chat.join",
        body: JSON.stringify({
          senderEmail: currentUserEmail,
          recipientEmail: selectedUser.email,
          content: "",
        }),
      });
    }
  }, [selectedUser, stompClient, currentUserEmail]);

  // Cuộn xuống cuối danh sách tin nhắn
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (messageInput.trim() && stompClient && selectedUser && stompClient.connected) {
      const chatMessage = {
        senderEmail: currentUserEmail,
        recipientEmail: selectedUser.email,
        content: messageInput,
        timestamp: "",
      };
      stompClient.publish({
        destination: "/app/chat.sendPrivateMessage",
        body: JSON.stringify(chatMessage),
      });
      setMessageInput("");
    }
  };

  // Xử lý nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-lg h-[92%]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-100 p-4 rounded-lg shadow-lg h-[92%]">
      {/* Danh sách người dùng */}
      <div className="w-1/3 bg-white p-4 overflow-y-auto rounded-lg shadow-md max-h-full">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <input
          className="border rounded-full py-2 px-4 w-full mb-4"
          placeholder="Search For Contacts or Messages"
          type="text"
        />
        <h3 className="text-lg font-semibold mb-2">All Chats</h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition hover:bg-gray-200 ${
                selectedUser?.id === user.id ? "bg-gray-300" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-2"></div>
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Today</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cửa sổ chat */}
      <div className="flex-1 bg-white p-4 flex flex-col rounded-lg shadow-md ml-4 max-h-full">
        {selectedUser ? (
          <>
            <div className="flex bg-[#74CEF7] items-center mb-4 p-2 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-2"></div>
              <div>
                <h4 className="font-semibold">{selectedUser.name}</h4>
                <p className="text-sm text-green-500">{selectedUser.status}</p>
              </div>
            </div>

            {/* Tin nhắn với scroll */}
            <div className="flex-1 overflow-y-auto max-h-full">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderEmail === currentUserEmail
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.senderEmail !== currentUserEmail && (
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-2"></div>
                    )}
                    <div>
                      <p
                        className={`p-2 rounded-lg ${
                          msg.senderEmail === currentUserEmail
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {msg.content}
                      </p>
                      <span className="text-sm text-gray-500">
                        {msg.senderEmail} {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input chat */}
            <div className="mt-4 flex items-center">
              <input
                className="border rounded-full py-2 px-4 flex-1"
                placeholder="Type Your Message"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="ml-2 bg-orange-500 text-white p-2 rounded-full"
                onClick={sendMessage}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
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