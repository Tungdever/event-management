import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";
import axios from "axios";
import Picker from "emoji-picker-react";
import { IoIosLink } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import MediaPreviewModal from "./MediaPreviewModal";
import { MdInsertEmoticon } from "react-icons/md";
import Swal from "sweetalert2";
const ChatBubble = ({ currentUser, initialSelectedUser, onClose }) => {
  const { stompClient, isConnected } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialSelectedUser || null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingStatus, setTypingStatus] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState({ url: "", type: "" });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const token = localStorage.getItem("token");

  const MEDIA_BASE_URL = "http://localhost:8080/uploads/";

  // Đóng emoji picker khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        console.log("Clicked outside, closing emoji picker");
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (initialSelectedUser) {
      setIsOpen(true);
      setSelectedUser(initialSelectedUser);
    }
  }, [initialSelectedUser]);

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
      if (!response.ok) {
        throw new Error(
          `Lấy danh sách người dùng thất bại: ${response.status}`
        );
      }
      const listUser = await response.json();
      const formattedUsers = listUser.map((user) => ({
        userId: user.userId,
        email: user.email,
        name: user.fullName || "Unknown",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);

      Swal.fire({
        icon: "error",
        title: "error",
        text: "Unable to load user list",
      });
    }
  };

  useEffect(() => {
    if (currentUser.userId) {
      fetchUsers();
    }
  }, [currentUser.userId, token]);

  useEffect(() => {
    if (stompClient && currentUser.email && isConnected) {
      const messageSubscription = stompClient.subscribe(
        `/user/${currentUser.email}/chat`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("Tin nhắn nhận được:", receivedMessage);
          if (
            selectedUser &&
            (receivedMessage.senderEmail === selectedUser.email ||
              receivedMessage.recipientEmail === selectedUser.email)
          ) {
            setMessages((prev) => {
              const messageKey = `${receivedMessage.timestamp}_${
                receivedMessage.senderEmail
              }_${receivedMessage.mediaUrl || ""}`;
              if (
                prev.some(
                  (msg) =>
                    `${msg.timestamp}_${msg.senderEmail}_${
                      msg.mediaUrl || ""
                    }` === messageKey
                )
              ) {
                console.log("Duplicate message ignored:", messageKey);
                return prev;
              }
              console.log("Adding message to state:", receivedMessage);
              return [...prev, receivedMessage];
            });
          }
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
          console.log("Trạng thái gõ:", typingData);
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
  }, [stompClient, currentUser.email, selectedUser, isOpen, isConnected]);

  useEffect(() => {
    if (selectedUser && currentUser.userId) {
      axios
        .get(
          `http://localhost:8080/chat/history/${currentUser.userId}/${selectedUser.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("Lịch sử chat:", response.data);
          setMessages(response.data);
          setUnreadCounts((prev) => ({
            ...prev,
            [selectedUser.email]: 0,
          }));
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "error",
            text: "RUnable to load chat history. Please try again.",
          });
        });
    }
  }, [selectedUser, currentUser.userId, token]);

  useEffect(() => {
    if (stompClient && selectedUser && inputMessage && isConnected) {
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
    if (stompClient && selectedUser && isConnected) {
      const typingDTO = {
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        isTyping: false,
      };
      stompClient.send("/app/typing", {}, JSON.stringify(typingDTO));
    }
  }, [inputMessage, stompClient, selectedUser, currentUser.email, isConnected]);

  const scrollToBottom = () => {
    console.log("Calling scrollToBottom");
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("messagesEndRef is not set");
    }
  };

  useEffect(() => {
    console.log("Messages updated, scrolling to bottom:", messages.length);
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File type:", file.type);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/chat/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileName = response.data;
      const contentType = file.type.startsWith("image") ? "IMAGE" : "VIDEO";
      console.log("Content type:", contentType);

      const messageDTO = {
        content: "",
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        timestamp: new Date().toISOString(),
        isRead: false,
        mediaUrl: fileName,
        contentType,
      };
      console.log("Sending messageDTO:", messageDTO);

      stompClient.send("/app/chat", {}, JSON.stringify(messageDTO));
      setMessages((prev) => [...prev, messageDTO]);
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Unable to upload file.",
      });
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() && selectedUser && stompClient && isConnected) {
      const messageDTO = {
        content: inputMessage,
        senderEmail: currentUser.email,
        recipientEmail: selectedUser.email,
        timestamp: new Date().toISOString(),
        isRead: false,
        mediaUrl: "",
        contentType: inputMessage.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)
          ? "EMOJI"
          : "TEXT",
      };
      console.log("Gửi tin nhắn:", messageDTO);
      stompClient.send("/app/chat", {}, JSON.stringify(messageDTO));
      setMessages((prev) => [...prev, messageDTO]);
      setInputMessage("");
      setShowEmojiPicker(false);
      setTimeout(scrollToBottom, 0);
    } else {
      if (!isConnected) {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Unable to send message: WebSocket connection lost.",
        });
      } else if (!selectedUser) {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Please select a user to chat with.",
        });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const openPreview = (mediaUrl, contentType) => {
    console.log("Opening preview:", { mediaUrl, contentType });
    setPreviewMedia({ url: `${MEDIA_BASE_URL}${mediaUrl}`, type: contentType });
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    console.log("Closing preview");
    setIsPreviewOpen(false);
    setPreviewMedia({ url: "", type: "" });
  };

  const renderMessageContent = (msg) => {
    console.log("Rendering message:", msg);
    if (!msg || !msg.contentType) {
      console.error("Invalid message:", msg);
      return <p className="text-red-500">Tin nhắn không hợp lệ</p>;
    }
    try {
      if (msg.contentType === "IMAGE") {
        if (!msg.mediaUrl) {
          console.error("Missing mediaUrl for IMAGE:", msg);
          return <p className="text-red-500">Không có URL hình ảnh</p>;
        }
        return (
          <img
            src={`${MEDIA_BASE_URL}${msg.mediaUrl}`}
            alt="media"
            className="max-w-[150px] rounded cursor-pointer"
            onClick={() => openPreview(msg.mediaUrl, "IMAGE")}
            onError={(e) => {
              console.error(
                `Failed to load image: ${MEDIA_BASE_URL}${msg.mediaUrl}`
              );
              e.target.replaceWith(
                <span className="text-red-500">Hình ảnh không tải được</span>
              );
            }}
            onLoad={() =>
              console.log("Image loaded:", `${MEDIA_BASE_URL}${msg.mediaUrl}`)
            }
          />
        );
      }
      if (msg.contentType === "VIDEO") {
        return (
          <video
            controls
            className="max-w-[150px] rounded cursor-pointer"
            onClick={() => openPreview(msg.mediaUrl, "VIDEO")}
          >
            <source src={`${MEDIA_BASE_URL}${msg.mediaUrl}`} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        );
      }
      if (msg.contentType === "TEXT" || msg.contentType === "EMOJI") {
        return <p>{msg.content || "(trống)"}</p>;
      }
      console.warn("Unknown contentType:", msg.contentType);
      return (
        <p>
          {typeof msg.content === "string"
            ? msg.content
            : "(nội dung không xác định)"}
        </p>
      );
    } catch (error) {
      console.error("Error rendering message:", error, msg);
      return <p className="text-red-500">Lỗi hiển thị tin nhắn</p>;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
            <h3 className="font-semibold">Tin nhắn</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.userId}
                    className="p-3 flex items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
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
                ))
              ) : (
                <p className="p-3 text-gray-500 text-sm">
                  Chưa có lịch sử trò chuyện
                </p>
              )}
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
              <div
                className="flex-1 p-3 overflow-y-auto bg-gray-50"
                style={{ maxHeight: "calc(100% - 120px)" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={`${msg.timestamp}_${msg.senderEmail}_${index}`}
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
                      {renderMessageContent(msg)}
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {typingStatus[selectedUser.email] && (
                  <div className="text-sm text-gray-500">Đang nhập...</div>
                )}
                <div ref={messagesEndRef} style={{ height: "1px" }} />
              </div>
              <div className="p-3 bg-white border-t border-gray-200 relative">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="px-2 py-1 text-gray-600"
                  >
                    <MdInsertEmoticon />
                  </button>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-2 py-1 text-gray-600"
                  >
                    <IoIosLink />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px]"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <IoSend />
                  </button>
                </div>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full right-0 mb-2 w-[370px] max-h-[350px] overflow-y-auto bg-white shadow-lg rounded-lg z-50 text-[12px]"
                  >
                    <Picker
                      onEmojiClick={(emojiObject) => {
                        console.log("Emoji selected:", emojiObject.emoji);
                        setInputMessage((prev) => prev + emojiObject.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <MediaPreviewModal
                isOpen={isPreviewOpen}
                onClose={closePreview}
                mediaUrl={previewMedia.url}
                contentType={previewMedia.type}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
