import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthProvider";
import Loader from "../../components/Loading";

const EventPage = () => {
    const [activeTab, setActiveTab] = useState("favorite");
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const token = localStorage.getItem("token");

    // Hàm lấy danh sách sự kiện yêu thích
    const fetchFavoriteEvents = async () => {
        if (!user || !user.userId) {
            setError("User not logged in");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/favorites/${user.userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch favorite events");
            }
            const data = await response.json();
            setFavoriteEvents(data);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching favorite events:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchFavoriteEvents();
    }, [user]);

    if (loading) {
        return (
            <div className="text-center p-6">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 text-red-600">
                Error: {error}. Please try again later.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Favorite Events</h2>

            {/* Tab chuyển đổi */}
            <div className="flex space-x-4 border-b pb-2">
                <button
                    onClick={() => setActiveTab("favorite")}
                    className={`px-4 py-2 font-medium flex items-center gap-2 transition ${
                        activeTab === "favorite"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-500"
                    }`}
                >
                    <i className={`ti ti-heart ${activeTab === "favorite" ? "text-red-500" : ""}`}></i>
                    Favorite
                </button>
            </div>

            {/* Danh sách sự kiện */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteEvents.map((event) => (
                    <div
                        key={event.eventId}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                        <img
                            src={event.eventImages && event.eventImages.length > 0
                                ? event.eventImages[0]
                                : "https://via.placeholder.com/300x150"}
                            alt={event.eventName}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{event.eventName || "Unnamed Event"}</h3>
                            <p className="text-gray-600">
                                {new Date(event.eventStart).toLocaleDateString("vi-VN")} •{" "}
                                {event.eventLocation?.city || event.eventLocation?.address || "Online"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiển thị khi không có sự kiện */}
            {favoriteEvents.length === 0 && (
                <p className="text-gray-500 text-center mt-6">No favorite events.</p>
            )}
        </div>
    );
};

export default EventPage;