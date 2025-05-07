import { useState, useEffect } from "react";
import { Bell, MoreHorizontal } from "lucide-react";
import { useAuth } from "../Auth/AuthProvider";

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const token = localStorage.getItem("token");

  const fetchHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/notify/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const result = await response.json();
      if (result.statusCode === 200) {
        setNotifications(result.data);
      } else {
        throw new Error(result.msg || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Failed to load notification history:", error);
    }
  };

  const readNoti = async (notiId) => {
    try {
      const response = await fetch(`http://localhost:8080/notify/${notiId}/read`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notiId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const readAllNoti = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/notify/readAll/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchHistory(user.userId);
    }
  }, [user]);

  // Format thời gian createdAt
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lọc thông báo theo tab
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notif) => !notif.read);

  return (
    <div className="mx-[8px] min-h-[800px] p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-bold">Thông báo</h1>
        <div className="flex items-center space-x-2">
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => readAllNoti(user?.userId)}
            disabled={!notifications.some((notif) => !notif.read)}
          >
            Đánh dấu tất cả đã đọc
          </button>
          <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg text-[14px] transition ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-[14px] transition ${
            activeTab === "unread"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Chưa đọc
        </button>
      </div>

      {/* List notifications */}
      <h2 className="text-[14px] font-semibold mb-4 text-gray-600">Trước đó</h2>
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500">Không có thông báo nào.</p>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition cursor-pointer min-h-[80px]"
            >
              {/* Icon thay cho avatar */}
              <Bell className="text-blue-500 w-12 h-12 p-2" />

              {/* Nội dung thông báo */}
              <div className="flex-1">
                <p className="text-sm leading-tight text-gray-900">
                  <span className="font-bold text-blue-800">{notif.title}</span>{" "}
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(notif.createdAt)}
                </p>
                {!notif.read && (
                  <button
                    className="text-blue-600 text-sm hover:underline mt-2"
                    onClick={() => readNoti(notif.id)}
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>

              {/* Icon nếu chưa đọc */}
              {!notif.read && <Bell className="text-blue-500 w-4 h-4" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;