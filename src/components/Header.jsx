import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

const LocationDropdown = ({ onLocationChange }) => {
  const [selected, setSelected] = useState("Ho Chi Minh");
  const [isOpen, setIsOpen] = useState(false);

  const locations = ["Ho Chi Minh", "Hanoi", "Da Nang"];

  
  const handleSelectCity = (city) => {
    setSelected(city);
    setIsOpen(false);
    onLocationChange(city); 
  };

  return (
    <div className="relative flex items-center px-4">
      <FaMapMarkerAlt className="text-gray-500 cursor-pointer" />
      <div
        className="relative ml-2 text-gray-500 text-sm cursor-pointer flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="px-3 py-2">{selected}</span>
        <FaChevronDown className="ml-2 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-8 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {locations.map((city, index) => (
            <div
              key={index}
              className="p-2 text-gray-700 text-sm hover:bg-orange-200 cursor-pointer transition"
              onClick={() => handleSelectCity(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Ho Chi Minh");
  const [searchType, setSearchType] = useState("eventName"); // Mặc định tìm theo tên sự kiện
  const [searchHistory, setSearchHistory] = useState([
    "Music Festival",
    "Tech Conference",
    "Art Exhibition",
    "Sports Event",
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef(null);

  // Xử lý click ngoài để ẩn lịch sử tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm gọi API searchEvents
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }
  
    try {
      const normalizedSearchTerm = searchTerm.trim().toLowerCase();
      let apiUrl = `http://localhost:8080/api/events/search?term=${encodeURIComponent(normalizedSearchTerm)}&type=${searchType}`;
  
      if (searchType === "city") {
        const normalizedLocation = selectedLocation.toLowerCase().replace(/\s+/g, "-");
        apiUrl = `http://localhost:8080/api/events/search?term=${encodeURIComponent(normalizedLocation)}&type=city`;
      }
      console.log("Fetching URL:", apiUrl);
  
      const response = await fetch(apiUrl, {
        headers: {
          "Accept": "application/json",
        },
      });
      console.log("Response status:", response.status);
  
      const responseText = await response.text(); // Lấy dữ liệu thô
      console.log("Raw response:", responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} - ${responseText}`);
      }
  
      const data = JSON.parse(responseText); // Parse thủ công để kiểm soát lỗi
      console.log("Parsed data:", data);
  
      if (!searchHistory.includes(searchTerm) && searchType !== "city") {
        setSearchHistory((prev) => [searchTerm, ...prev.slice(0, 3)]);
      }
  
      navigate("/search", { state: { events: data } });
    } catch (error) {
      console.error("Error fetching events:", error.message);
      alert(`Failed to search events: ${error.message}`);
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Danh sách các loại tìm kiếm
  const searchTypes = [
    { value: "eventName", label: "Event Name" },
    { value: "city", label: "City" },
    { value: "venueName", label: "Venue Name" },
    { value: "eventTag", label: "Tag" },
    { value: "eventType", label: "Event Type" },
    { value: "eventHost", label: "Host" },
  ];

  return (
    <div
      className="relative flex items-center bg-white rounded-full border p-2 w-full max-w-2xl text-[13px] h-[40px]"
      ref={searchRef}
    >
      {/* Input tìm kiếm */}
      <div className="flex items-center px-4 w-[300px]">
        <i className="fas fa-search text-gray-500"></i>
        <input
          type="text"
          placeholder={`Search by ${searchTypes.find(t => t.value === searchType)?.label || "Event Name"}`}
          className="ml-2 outline-none text-gray-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Dropdown chọn loại tìm kiếm */}
      <div className="flex items-center px-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="outline-none text-gray-500 bg-transparent"
        >
          {searchTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lịch sử tìm kiếm */}
      {showHistory && searchType !== "city" && (
        <div className="absolute top-full left-10 w-[286px] bg-white border rounded shadow-lg z-50">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(item);
                setShowHistory(false);
                handleSearch();
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Dropdown chọn location (chỉ hiển thị nếu searchType là city) */}
      {searchType === "city" && (
        <>
          <div className="border-l border-gray-300 h-6 mx-4"></div>
          <div className="relative flex items-center px-4">
            <LocationDropdown onLocationChange={setSelectedLocation} />
          </div>
        </>
      )}

      {/* Nút tìm kiếm */}
      <button
        className="ml-auto bg-red-600 text-white rounded-full px-2 py-1 hover:bg-red-700"
        onClick={handleSearch}
      >
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const handleCreateEventClick = (e) => {
    
    navigate("/createEvent"); 
  };
  const handleHomepage = (e) => {
    
    navigate("/"); 
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white shadow fixed top-0 left-0 w-full z-10">
      <div className="w-full px-4 py-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="text-red-500 text-xl font-bold ml-4 cursor-pointer hover:text-red-700 transition duration-300"
        onClick={handleHomepage} >
          Manage Event
        </div>
        <SearchBar />
        {/* Navigation Menu */}
        <div className="flex items-center gap-6 mx-4">
          {[
            { icon: "bi-calendar4-event", text: "Create event" },
            { icon: "bi bi-heart", text: "Likes" },
            { icon: "bi bi-question-circle", text: "Help" },
          ].map((item, index) => (
            <a
              key={index}
              
              className="flex flex-col items-center text-gray-500 text-[13px] font-medium px-[20px] cursor-pointer hover:text-blue-500 transition duration-300"
              onClick={item.text === "Create event" ? handleCreateEventClick : null} 
            >
              <i className={`${item.icon} text-lg`}></i>
              {item.text}
            </a>
          ))}
          {/* User Profile */}
          <div
            className="relative flex items-center text-gray-500 text-[13px] pl-[20px] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuRef}
            onMouseEnter={() => setIsMenuOpen(true)}
          >
            <i className="fa-solid fa-user text-lg"></i>
            <p className="pl-[6px] font-medium">trungbo.234416@gmail.com</p>
            <i className="bi bi-chevron-down pt-[4px] pl-[3px] cursor-pointer"></i>
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-[205px] bg-white border rounded shadow-lg z-50"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                {[
                  "Browse events",
                  "Manage my events",
                  "Tickets (0)",
                  "Liked",
                  "Following",
                  "Interests",
                  "Account settings",
                  "Log out",
                ].map((item, index) => (
                  <a
                    key={index}
                    href="/dashboard"
                    className="block pl-4 pr-10 py-4 text-gray-700 hover:bg-gray-100 transition duration-200 font-semibold text-[14px]"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;