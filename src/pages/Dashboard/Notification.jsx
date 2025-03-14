import { useState } from "react";
import { Bell, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

const NotificationList = ({ notifications }) => {
  const [activeTab, setActiveTab] = useState("all");

  // Lọc thông báo theo tab
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notif) => !notif.hasActions);

  return (
    <div className="mx-[8px] min-h-[800px] p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-bold ">Thông báo</h1>
        <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-700" />
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
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-start space-x-4 p-4 rounded-lg  hover:bg-blue-50 transition cursor-pointer min-h-[80px]"
          >
            {/* Avatar */}
            <img
              src={notif.image}
              alt={notif.name}
              className="w-12 h-12 rounded-full border border-gray-300"
            />

            {/* Nội dung thông báo */}
            <div className="flex-1">
              <p className="text-sm leading-tight text-gray-900">
                <span className="font-bold text-blue-800">{notif.name}</span>{" "}
                {notif.message}
              </p>
              <p className="text-xs text-gray-500">{notif.time}</p>
              {notif.mutualFriends && (
                <p className="text-xs text-gray-400">{notif.mutualFriends}</p>
              )}

              {/* Hiển thị nút hành động nếu có */}
              {notif.hasActions && (
                <div className="flex space-x-2 mt-2">
                  <button className="flex items-center justify-center px-4 py-2 w-[140px] bg-blue-600 rounded-lg text-white text-[12px] hover:bg-blue-700 transition">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Xác nhận</span>
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 w-[140px] bg-gray-500 rounded-lg text-white text-[12px] hover:bg-gray-600 transition">
                    <XCircle className="w-4 h-4 mr-1" />
                    <span>Xóa</span>
                  </button>
                </div>
              )}
            </div>

            {/* Icon nếu là thông báo chưa đọc */}
            {!notif.hasActions && <Bell className="text-blue-500 w-4 h-4" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
