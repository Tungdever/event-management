import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './WebSocketContext';
import axios from 'axios';

const ChatBox = () => {
  const { stompClient } = useWebSocket();
  const [users, setUsers] = useState([
    { userId: 2, email: 'trung@gmail.com', name: 'User Two' },
    { userId: 3, email: 'trung123@gmail.com', name: 'User Three' },
  ]); // Giả lập danh sách người dùng
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const currentUser = { userId: 5, email: 'trungho002002002@gmail.com' }; // Giả lập người dùng hiện tại

  // Log thông tin người dùng hiện tại khi component được mount
  useEffect(() => {
    console.log('Current user:', currentUser.email);
  }, []);

  // Cuộn đến tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lấy lịch sử trò chuyện khi chọn người dùng
  useEffect(() => {
    if (selectedUser) {
      console.log('Fetching chat history for users:', {
        currentUserId: currentUser.userId,
        selectedUserId: selectedUser.userId,
      });
      axios
        .get(`http://localhost:8080/chat/history/${currentUser.userId}/${selectedUser.userId}`)
        .then((response) => {
          console.log('Chat history response:', response.data);
          setMessages(response.data);
        })
        .catch((error) => {
          console.error('Error fetching chat history:', error);
        });
    }
  }, [selectedUser]);

  // Đăng ký nhận tin nhắn WebSocket
  useEffect(() => {
    if (stompClient) {
      console.log('Subscribing to WebSocket for email:', currentUser.email);
      console.log('stompClient status:', stompClient.connected ? 'Connected' : 'Not connected');
      const subscription = stompClient.subscribe(`/user/${currentUser.email}/chat`, (message) => {
        console.log('Received WebSocket message:', message.body);
        const receivedMessage = JSON.parse(message.body);
        console.log('Parsed received message:', receivedMessage);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      return () => {
        console.log('Unsubscribing from WebSocket for email:', currentUser.email);
        subscription?.unsubscribe();
      };
    } else {
      console.log('stompClient is not initialized');
    }
  }, [stompClient]);

  // Cuộn đến tin nhắn mới nhất khi danh sách tin nhắn thay đổi
  useEffect(() => {
    console.log('Messages updated:', messages);
    scrollToBottom();
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = () => {
    console.log('Attempting to send message. Input:', inputMessage, 'Selected user:', selectedUser, 'stompClient:', !!stompClient);
    if (inputMessage.trim() && selectedUser && stompClient) {
      const messageDTO = {
        content: inputMessage,
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        timestamp: new Date().toISOString(),
      };
      console.log('Sending MessageDTO:', messageDTO);
      stompClient.send('/app/chat', {}, JSON.stringify(messageDTO));
      console.log('Message sent to /app/chat');
      setInputMessage('');
    } else {
      console.log('Cannot send message. Missing:', {
        inputMessage: !inputMessage.trim(),
        selectedUser: !selectedUser,
        stompClient: !stompClient,
      });
    }
  };

  // Xử lý nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed. Triggering sendMessage');
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
                selectedUser?.userId === user.userId ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                console.log('Selected user:', user);
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
              <h2 className="ml-3 text-lg font-semibold">{selectedUser.name}</h2>
            </div>

            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.senderEmail === currentUser.email ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderEmail === currentUser.email
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
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
                    console.log('Input message changed:', e.target.value);
                    setInputMessage(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    console.log('Send button clicked');
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