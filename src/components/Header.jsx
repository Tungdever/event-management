import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

const LocationDropdown = ({ onLocationChange }) => {
  const [selected, setSelected] = useState("ho-chi-minh"); 
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

 
  const locations = [
    { slug: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
    { slug: "ha-noi", name: "Hà Nội" },
    { slug: "da-nang", name: "Đà Nẵng" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (citySlug) => {
    setSelected(citySlug);
    setIsOpen(false);
    onLocationChange(citySlug);
  };

  return (
    <div className="relative flex items-center px-4" ref={dropdownRef}>
      <FaMapMarkerAlt className="text-gray-500 cursor-pointer" />
      <div
        className="relative ml-2 text-gray-500 text-sm cursor-pointer flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="px-3 py-2">
          {locations.find((loc) => loc.slug === selected)?.name || selected}
        </span>
        <FaChevronDown className="ml-2 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-8 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {locations.map((city) => (
            <div
              key={city.slug}
              className="p-2 text-gray-700 text-sm hover:bg-orange-200 cursor-pointer transition"
              onClick={() => handleSelectCity(city.slug)}
            >
              {city.name}
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
  const [selectedLocation, setSelectedLocation] = useState("ho-chi-minh"); 
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const normalizeVenueName = (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  };
  // Hàm gọi API searchEventsByNameAndCity
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }

    try {
      const normalizedSearchTerm = normalizeVenueName(searchTerm)
      console.log("input search "+ normalizedSearchTerm +" city "+ selectedLocation)
      const apiUrl = `http://localhost:8080/api/events/search/by-name-and-city?term=${encodeURIComponent(normalizedSearchTerm)}&city=${encodeURIComponent(selectedLocation)}`;
      console.log("Fetching URL:", apiUrl);

      const response = await fetch(apiUrl);
      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log("Parsed data:", data);

      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory((prev) => [searchTerm, ...prev.slice(0, 3)]);
      }

      navigate("/search", { state: { events: data, searchTerm:normalizedSearchTerm } });
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

  return (
    <div
      className="relative flex items-center bg-white rounded-full border p-2 w-full max-w-2xl text-[13px] h-[40px]"
      ref={searchRef}
    >
      {/* Input tìm kiếm */}
      <div className="flex items-center px-4 w-[260px]">
        <i className="fas fa-search text-gray-500"></i>
        <input
          type="text"
          placeholder="Search events by name"
          className="ml-2 outline-none text-gray-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Lịch sử tìm kiếm */}
      {showHistory && (
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

      {/* Dropdown chọn location */}
      <div className="border-l border-gray-300 h-6 mx-4"></div>
      <div className="relative flex items-center px-4">
        <LocationDropdown onLocationChange={setSelectedLocation} />
      </div>

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
  const handleLike = (e) =>{
    navigate("/event-like")
  }
  const handleMyTicket = (e) =>{
    navigate("/myticket")
  }

  const menuItems = [
    { icon: "bi-calendar4-event", text: "Create event", action: handleCreateEventClick },
    { icon: "bi-heart", text: "Likes", action: handleLike },
    { icon: "bi-question-circle", text: "Help", action: null },
  ];
       
  const handleDashboard = (e) =>{
    navigate("/dashboard")
  }
  const handleLogout = (e) =>{
    navigate("/logout")
  }
  const menuPopup = [
    {title: "Browse events",action: null},
    {title: "Manage my events",action: handleDashboard},
    {title: "Liked",action: null},
    {title: "Tickets ",action: handleMyTicket},
    {title: "Following",action: null},
    {title: "Account settings",action: null},
    {title: "Log out",action: handleLogout},
  ]

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
          {menuItems.map((item, index) => (
              <a
                key={index}
                className="flex flex-col items-center text-gray-500 text-[13px] font-medium px-[20px] cursor-pointer hover:text-blue-500 transition duration-300"
                onClick={item.action}
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
                {menuPopup.map((item, index) => (
                  <a
                    key={index}
                    className="block pl-4 pr-10 py-4 text-gray-700 hover:bg-gray-100 transition duration-200 font-semibold text-[14px]"
                    onClick={item.action}
                  >
                    {item.title}
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