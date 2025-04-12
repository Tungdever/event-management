import React, { useState } from "react";

const EventPage = () => {
    const [activeTab, setActiveTab] = useState("favorite");

    const events = {
        favorite: [
            { id: 1, name: "Tech Conference 2025", date: "20/05/2025", location: "Hà Nội", image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg" },
            { id: 2, name: "AI Summit 2025", date: "10/06/2025", location: "TP.HCM", image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg" },
        ],
        watched: [
            { id: 3, name: "Blockchain Expo", date: "05/03/2025", location: "Đà Nẵng", viewedAt: "12/03/2025 14:30", image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg" },
            { id: 4, name: "Startup Demo Day", date: "12/04/2025", location: "Hải Phòng", viewedAt: "15/04/2025 09:15", image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg" },
        ],
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event History</h2>

            {/* Tab chuyển đổi */}
            <div className="flex space-x-4 border-b pb-2">
                <button
                    onClick={() => setActiveTab("favorite")}
                    className={`px-4 py-2 font-medium flex items-center gap-2 transition ${
                        activeTab === "favorite" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-500"
                    }`}
                >
                    <i className={`ti ti-heart ${activeTab === "favorite" ? "text-red-500" : ""}`}></i>
                    Favorite
                </button>

                <button
                    onClick={() => setActiveTab("watched")}
                    className={`px-4 py-2 font-medium flex items-center gap-2 transition ${
                        activeTab === "watched" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-500"
                    }`}
                >
                    <i className={`ti ti-history ${activeTab === "watched" ? "text-green-500" : ""}`}></i>
                    Watched
                </button>
            </div>

            {/* Danh sách sự kiện */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events[activeTab].map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                        <img src={event.image} alt={event.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{event.name}</h3>
                            <p className="text-gray-600">{event.date} • {event.location}</p>

                            {/* Chỉ hiển thị thời gian xem cho tab "Watched" */}
                            {activeTab === "watched" && (
                                <p className="text-sm text-gray-500 mt-2">⏱ {event.viewedAt}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiển thị khi không có sự kiện */}
            {events[activeTab].length === 0 && (
                <p className="text-gray-500 text-center mt-6">No anything.</p>
            )}
        </div>
    );
};

export default EventPage;
