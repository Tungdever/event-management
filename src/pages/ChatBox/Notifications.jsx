import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("token");
    const [userId, setUserId] = useState(null);

    // Lấy userId từ token
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserId(payload.userId);
            } catch (e) {
                console.error("Error decoding token:", e);
            }
        }
    }, [token]);

    // Lấy danh sách thông báo
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/notify/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setNotifications(response.data.data || []);
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
            });
        }
    }, [userId, token]);

    // Đánh dấu một thông báo đã đọc
    const markAsRead = (notificationId) => {
        axios.put(`http://localhost:8080/notify/${notificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
        })
        .catch((error) => {
            console.error("Error marking notification as read:", error);
        });
    };

    // Đánh dấu tất cả thông báo đã đọc
    const markAllAsRead = () => {
        if (userId) {
            axios.put(`http://localhost:8080/notify/readAll/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, isRead: true }))
                );
            })
            .catch((error) => {
                console.error("Error marking all notifications as read:", error);
            });
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <button
                    onClick={markAllAsRead}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={!notifications.some((notif) => !notif.isRead)}
                >
                    Mark All as Read
                </button>
            </div>
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications</p>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-lg border ${
                                notif.isRead ? "bg-gray-100" : "bg-white border-gray-300"
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{notif.title}</h3>
                                    <p className="text-gray-600">{notif.message}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(notif.createdAt).toLocaleString("en-US", {
                                            timeZone: "Asia/Ho_Chi_Minh",
                                        })}
                                    </p>
                                </div>
                                {!notif.isRead && (
                                    <button
                                        onClick={() => markAsRead(notif.id)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Notifications;