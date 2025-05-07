import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import Footer from "../../components/Footer";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const SearchByType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.state?.categoryName || "";
  const [events, setEvents] = useState(location.state?.events || []);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const eventsPerPage = 4;

  const wallper = [
    { 
      id: 1, 
      type: "Music", 
      wallper: "https://i.pinimg.com/736x/16/91/f8/1691f8d6bea96494d2cf50994b530a3a.jpg",
      backgroundColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
      textColor: "text-yellow-200",
      slogan: "Feel the Beat!"
    },
    { 
      id: 2, 
      type: "Nightlife", 
      wallper: "https://i.pinimg.com/736x/d4/87/40/d4874012f8576f9b791082c343e0e6b8.jpg",
      backgroundColor: "bg-gradient-to-r from-purple-600 to-pink-500",
      textColor: "text-white",
      slogan: "Light Up the Night!"
    },
    { 
      id: 3, 
      type: "Performing", 
      wallper: "https://i.pinimg.com/736x/ad/27/ef/ad27ef55839b1d23659869719d7d246b.jpg",
      backgroundColor: "bg-red-700",
      textColor: "text-amber-200",
      slogan: "Shine on Stage!"
    },
    { 
      id: 4, 
      type: "Holidays", 
      wallper: "https://i.pinimg.com/736x/1d/82/aa/1d82aa438152e8cc1918b2c99a4dc845.jpg",
      backgroundColor: "bg-gradient-to-r from-[#E8D5A2] to-[#E6B680]",
      textColor: "text-[#28504E]",
      slogan: "Celebrate the Moment!"
    },
    { 
      id: 5, 
      type: "Dating", 
      wallper: "https://i.pinimg.com/736x/fd/bf/35/fdbf357c58c396eea58d49fe63520aad.jpg",
      backgroundColor: "bg-rose-400",
      textColor: "text-white",
      slogan: "Find Your Spark!"
    },
    { 
      id: 6, 
      type: "Hobbies", 
      wallper: "https://i.pinimg.com/736x/62/d0/4e/62d04e9b4ba60658c31775b718f87999.jpg",
      backgroundColor: "bg-teal-400",
      textColor: "text-gray-800",
      slogan: "Unleash Your Passion!"
    },
    { 
      id: 7, 
      type: "Business", 
      wallper: "https://i.pinimg.com/736x/08/42/0a/08420a20017446fdda37f5d3f132dc88.jpg",
      backgroundColor: "bg-blue-800",
      textColor: "text-gray-100",
      slogan: "Connect & Succeed!"
    },
    { 
      id: 8, 
      type: "Food & Drink", 
      wallper: "https://i.pinimg.com/736x/72/2c/8f/722c8fc121b89f7fb1669c36ffbb09a1.jpg",
      backgroundColor: "bg-gradient-to-r from-orange-400 to-red-400",
      textColor: "text-white",
      slogan: "Savor the Flavor!"
    },
    { 
      id: 9, 
      type: "Conference", 
      wallper: "https://i.pinimg.com/736x/c8/57/93/c85793cc309c0b82e20138f47625b803.jpg",
      backgroundColor: "bg-gradient-to-r from-[#28504E] to-[#1E1C38]",
      textColor: "text-cyan-200",
      slogan: "Ideas That Inspire!"
    }
  ];

  // Tìm thông tin tương ứng với categoryName
  const selectedCategory = wallper.find(item => item.type.toLowerCase() === categoryName.toLowerCase()) || {
    wallper: "https://via.placeholder.com/480x290",
    backgroundColor: "bg-gray-500",
    textColor: "text-white"
  };

  useEffect(() => {
    if (events && events.length > 0) {
      const initialEvents = events.slice(0, eventsPerPage * 2);
      setDisplayedEvents(initialEvents);
      setPage(3);
    } else {
      setDisplayedEvents([]);
      setPage(1);
    }
    window.scrollTo(0, 0);
  }, [events]);

  const handleViewMore = () => {
    setIsLoading(true);

    setTimeout(() => {
      const startIndex = displayedEvents.length;
      const endIndex = startIndex + eventsPerPage;
      const newEvents = events.slice(startIndex, endIndex);
      setDisplayedEvents((prev) => [...prev, ...newEvents]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    }, 500);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <>
      <div className={`w-full h-[290px] ${selectedCategory.backgroundColor} grid grid-cols-2 my-6 gap-6 place-items-center`}>
        <div className={`${selectedCategory.textColor} font-weight-800 flex flex-col items-start justify-center`}>
          <h1 className="text-5xl text-center font-extrabold font-mono">
            {(categoryName ? ` ${categoryName}` : "Upcoming Events").toUpperCase()}
          </h1>
          <p className="text-lg text-center mt-2">{selectedCategory.slogan}</p>
        </div>
        <img
          src={selectedCategory.wallper}
          className="w-[480px] h-[290px] object-cover"
          alt={categoryName || "Upcoming Events"}
        />
      </div>
      <div className="container mx-auto px-8 py-4 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {(categoryName ? `Upcoming Events for ${categoryName}` : "Upcoming Events").toUpperCase()}
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No events found for this category.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedEvents.map((event) => (
                <div
                  key={event.eventId}
                  onClick={() => handleEventClick(event.eventId)}
                  className="max-w-[300px] min-h-[400px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 cursor-pointer transition-shadow"
                >
                  <div className="w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                    {event.eventImages && event.eventImages.length > 0 ? (
                      <img
                        src={event.eventImages[0]}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/300x150"
                        alt="Default Event"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {truncateText(event.eventName, 25) || "Unnamed Event"}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 truncate">
                      {truncateText(event.eventDesc, 30) || "No description"}
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      <span className="font-medium">Ngày:</span>{" "}
                      {new Date(event.eventStart).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Thời gian:</span>{" "}
                      {new Date(event.eventStart).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.eventEnd).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-gray-700 text-sm mt-1 truncate">
                      <span className="font-medium">Địa điểm:</span>{" "}
                      {truncateText(event.eventLocation.city, 25) || "Không có địa điểm"}
                    </p>
                  </div>
                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {event.tags && typeof event.tags === "string" ? (
                      event.tags.split("|").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {truncateText(tag.trim(), 10)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 text-xs">Không có tag</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {displayedEvents.length < events.length && (
              <div className="flex justify-center mt-6">
                {isLoading ? (
                  <Loader />
                ) : (
                  <button
                    onClick={handleViewMore}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Xem thêm
                  </button>
                )}
              </div>
            )}
          </>
        )}
        <Footer />
      </div>
    </>
  );
};

export default SearchByType;