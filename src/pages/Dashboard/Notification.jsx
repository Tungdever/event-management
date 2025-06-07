import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, MoreHorizontal } from "lucide-react";
import { useAuth } from "../Auth/AuthProvider";
import Footer from "../../components/Footer";
const NotificationList = () => {
  const { t, i18n } = useTranslation();
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
        throw new Error(t('notifications.errorFetch'));
      }
      const result = await response.json();
      if (result.statusCode === 200) {
        setNotifications(result.data);
      } else {
        throw new Error(result.msg || t('notifications.errorFetch'));
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
        throw new Error(t('notifications.errorMarkRead'));
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
        throw new Error(t('notifications.errorMarkAllRead'));
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
    window.scrollTo(0, 0);
  }, [user]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(i18n.language, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const translateTitle = (title) => {
    if (title === 'New Message') {
      return t('notifications.newMessageTitle')
    }
    else if (title === 'New Event') {
      return t('notifications.newEventTitle')
    }
    else {
      return t('notifications.notiTitle')
    }
  };
  const translateMessage = (message) => {
    if (message.includes('You have a new message from')) {
      const user = message.replace('You have a new message from ', '');
      return t('notifications.newMessage', { user });
    }
    else if (message.includes('You have saved the')) {
      const newMessage1 = message.replace('You have saved the ', '');
      const event = newMessage1.replace(' event on your favorite list', '');
      return t('notifications.noti', { event })
    }
    else {
      const event = message.replace(' was successfully created', '');
      return t('notifications.noti', { event})
    }
  };
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notif) => !notif.read);


  return (
    <>
      <div className="mx-auto max-w-3xl min-h-[800px] p-6 bg-white rounded-xl shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('notifications.header')}
          </h1>
          <div className="flex items-center space-x-3">
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => readAllNoti(user?.userId)}
              disabled={!notifications.some((notif) => !notif.read)}
              aria-label={t('notifications.markAllAsRead')}
            >
              {t('notifications.markAllAsRead')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "all"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab("all")}
            aria-label={t('notifications.tabAll')}
          >
            {t('notifications.tabAll')}
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "unread"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab("unread")}
            aria-label={t('notifications.tabUnread')}
          >
            {t('notifications.tabUnread')}
          </button>
        </div>

        {/* List notifications */}
        <h2 className="text-sm font-semibold text-gray-500 mb-4">
          {t('notifications.previousSection')}
        </h2>
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {t('notifications.noNotifications')}
            </p>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <Bell className="text-indigo-500 w-10 h-10 p-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    <span className="font-semibold text-indigo-700">{translateTitle(notif.title)}</span>{" "}
                    {translateMessage(notif.message)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDateTime(notif.createdAt)}
                  </p>
                  {!notif.read && (
                    <button
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-800 mt-2 transition-colors duration-200"
                      onClick={() => readNoti(notif.id)}
                      aria-label={t('notifications.markAsRead')}
                    >
                      {t('notifications.markAsRead')}
                    </button>
                  )}
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotificationList;