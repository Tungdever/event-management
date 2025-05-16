import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../pages/Auth/AuthProvider";
import { api } from "../pages/Auth/api";
import Swal from "sweetalert2";
import UpgradeOrganizerDialog from "./UpgradeOrganizerDialog";

const LocationDropdown = ({ onLocationChange }) => {
  const [selected, setSelected] = useState("ho-chi-minh");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
 
  const locations = [
    {slug:"all-locations",name:"All-locations"},
    { slug: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
    { slug: "ha-noi", name: "Hà Nội" },
    { slug: "da-nang", name: "Đà Nẵng" },
    { slug: "hai-phong", name: "Hải Phòng" },
    { slug: "can-tho", name: "Cần Thơ" },
    { slug: "nha-trang", name: "Nha Trang" },
    { slug: "da-lat", name: "Đà Lạt" },
    { slug: "binh-duong", name: "Bình Dương" },
    { slug: "dong-nai", name: "Đồng Nai" },
    { slug: "quang-ninh", name: "Quảng Ninh" },
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
    <div
      className="relative flex items-center px-2 sm:px-3 md:px-3 lg:px-4 w-[120px] lg:w-[200px]"
      ref={dropdownRef}
    >
      <FaMapMarkerAlt className="text-gray-500 cursor-pointer text-sm sm:text-base md:text-sm lg:text-base" />
      <div
        className="relative ml-1 sm:ml-2 md:ml-1 lg:ml-2 text-gray-500 text-xs sm:text-sm md:text-xs lg:text-sm cursor-pointer flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="px-2 sm:px-3 md:px-2 lg:px-3 py-1 sm:py-2 md:py-1 lg:py-2 truncate w-full">
          {locations.find((loc) => loc.slug === selected)?.name || selected}
        </span>
        <FaChevronDown className="ml-1 sm:ml-2 md:ml-1 lg:ml-2 text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-4 sm:left-6 md:left-6 lg:left-8 mt-2 w-36 sm:w-44 md:w-40 lg:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {locations.map((city) => (
            <div
              key={city.slug}
              className="p-2 text-gray-700 text-xs sm:text-sm md:text-xs lg:text-sm hover:bg-orange-200 cursor-pointer transition"
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
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    try {
      const apiUrl = `http://localhost:8080/api/events/search/by-name-and-city?term=${searchTerm}&city=${selectedLocation}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        if (!searchHistory.includes(searchTerm)) {
          setSearchHistory((prev) => [searchTerm, ...prev.slice(0, 3)]);
        }
        navigate("/search", {
          state: { events: data, searchTerm: searchTerm },
        });
      } else {
        console.error("No valid data received from API");
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không tìm thấy sự kiện nào",
        });
      }
    } catch (error) {
      console.error("Error fetching events:", error.message);
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Failed to search events",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className="relative flex items-center bg-white rounded-full border p-1 sm:p-2 md:p-1 lg:p-2 w-full max-w-xs sm:max-w-md md:max-w-[360px] lg:max-w-2xl  text-xs sm:text-[13px] md:text-[12px] lg:text-[13px] h-8 sm:h-10 md:h-9 lg:h-[40px]"
      ref={searchRef}
    >
      <div className="flex items-center px-2 sm:px-3 md:px-3 lg:px-4 w-[180px] sm:w-[220px] md:w-[200px] lg:w-[260px]">
        <i className="fas fa-search text-gray-500 text-sm sm:text-base md:text-sm lg:text-base"></i>
        <input
          type="text"
          placeholder="Search events by name"
          className="ml-1 sm:ml-2 md:ml-1 lg:ml-2 outline-none text-gray-500 w-full text-xs sm:text-sm md:text-xs lg:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyPress={handleKeyPress}
        />
      </div>
      {showHistory && (
        <div className="absolute top-full left-6 sm:left-8 md:left-8 lg:left-10 w-[180px] sm:w-[220px] md:w-[200px] lg:w-[286px] bg-white border rounded shadow-lg z-50">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm md:text-xs lg:text-sm"
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
      <div className="border-l border-gray-300 h-4 sm:h-6 md:h-5 lg:h-6 mx-2 sm:mx-3 md:mx-3 lg:mx-4"></div>
      <div className="relative flex items-center px-2 sm:px-3 md:px-3 lg:px-4">
        <LocationDropdown onLocationChange={setSelectedLocation} />
      </div>
      <button
        className="ml-auto bg-red-600 text-white rounded-full px-2 sm:px-2 md:px-1 lg:px-2 py-0.5 sm:py-1 md:py-0.5 lg:py-1 hover:bg-red-700"
        onClick={handleSearch}
      >
        <i className="fas fa-search text-sm sm:text-base md:text-sm lg:text-base"></i>
      </button>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleCreateEventClick = () => {
    navigate("/createEvent");
    setIsMobileMenuOpen(false);
  };
  const handleHomepage = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };
  const handleLike = () => {
    navigate("/event-like");
    setIsMobileMenuOpen(false);
  };
  const handleMyTicket = () => {
    navigate("/myticket");
    setIsMobileMenuOpen(false);
  };
  const handleDashboard = () => {
    navigate("/dashboard");
    setIsMobileMenuOpen(false);
  };
  const handleChat = () => {
    navigate("/chat");
    setIsMobileMenuOpen(false);
  };
  const handleNoti = () => {
    navigate("/notification");
    setIsMobileMenuOpen(false);
  };
  const handleAdmin = () => {
    navigate("/admin");
    setIsMobileMenuOpen(false);
  };
  const handleLogout = async () => {
    try {
      await api.logout();
      logout();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Logged out successfully",
      });
      navigate("/login");
      setIsMobileMenuOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Logout failed: " + (error.msg || "Server error"),
      });
    }
  };

  const menuItems = [
    {
      icon: "bi-calendar4-event",
      text: "Create event",
      action: handleCreateEventClick,
    },
    { icon: "bi-heart", text: "Likes", action: handleLike },
    { icon: "bi bi-bell", text: "Noti", action: handleNoti },
  ];

  const menuPopup = [
    {
      title: "Manage my events",
      action: handleDashboard,
      roles: [
        "ORGANIZER",
        "TICKET MANAGER",
        "EVENT ASSISTANT",
        "CHECK-IN STAFF",
      ],
    },
    {
      title: "Tickets",
      action: handleMyTicket,
      roles: ["ATTENDEE", "ORGANIZER"],
    },
    { title: "Admin Dashboard", action: handleAdmin, roles: ["ADMIN"] },
    { title: "Log out", action: handleLogout },
    // { title: "Chatbox", action: handleChat, roles: ["ATTENDEE"] },
    {
      title: "Up to Organizer",
      action: () => setOpenUpgradeDialog(true),
      roles: ["ATTENDEE"],
    },
  ];

  const filteredMenuPopup = menuPopup.filter(
    (item) =>
      !item.roles ||
      item.roles.some((role) => user?.primaryRoles?.includes(role))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow fixed top-0 left-0 w-full z-10">
      <div className="w-full px-4 py-2 sm:py-3 md:py-3 lg:py-4 h-auto sm:h-auto md:h-14 lg:h-16 flex flex-col sm:flex-col md:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full sm:w-full md:w-auto">
          <div
            className="text-red-500 text-base sm:text-lg md:text-lg lg:text-2xl font-bold cursor-pointer hover:text-red-700 transition duration-300"
            onClick={handleHomepage}
          >
            Manage Event
          </div>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars text-base sm:text-lg md:text-lg"></i>
          </button>
        </div>
        <div className="w-full sm:w-full md:w-auto mt-2 sm:mt-2 md:mt-0">
          <SearchBar />
        </div>
        <div
          className="hidden md:flex items-center gap-2 md:gap-3 lg:gap-6 mx-0 md:mx-4"
          ref={menuRef}
        >
          {menuItems.map((item, index) => (
            <a
              key={index}
              className="flex flex-col items-center text-gray-500 text-[11px] md:text-[12px] lg:text-[13px] font-medium px-2 md:px-3 lg:px-[20px] cursor-pointer hover:text-blue-500 transition duration-300"
              onClick={item.action}
            >
              <i className={`${item.icon} text-sm md:text-base lg:text-lg`}></i>
              {item.text}
            </a>
          ))}
          <div
            className="relative flex items-center text-gray-500 text-[11px] md:text-[12px] lg:text-[13px] pl-2 md:pl-3 lg:pl-[20px] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={() => setIsMenuOpen(true)}
          >
            {user ? (
              <>
                <i className="fa-solid fa-user text-sm md:text-base lg:text-lg"></i>
                <p className="pl-1 md:pl-1 lg:pl-[6px] font-medium hidden lg:block">
                  {user.email}
                </p>
                <i className="bi bi-chevron-down pt-1 md:pt-1 lg:pt-[4px] pl-1 md:pl-1 lg:pl-[3px] cursor-pointer text-xs md:text-sm lg:text-sm"></i>
                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-44 md:w-48 lg:w-[205px] bg-white border rounded shadow-lg z-50"
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    {filteredMenuPopup.map((item, index) => (
                      <a
                        key={index}
                        className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-200 font-semibold text-sm"
                        onClick={item.action}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-500 hover:text-blue-500 px-2 md:px-2 lg:px-2 text-[11px] md:text-[12px] lg:text-[13px]"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="text-gray-500 hover:text-blue-500 px-2 md:px-2 lg:px-2 text-[11px] md:text-[12px] lg:text-[13px]"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden w-full bg-white border-t mt-2 py-2"
            ref={mobileMenuRef}
          >
            {menuItems.map((item, index) => (
              <a
                key={index}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                onClick={item.action}
              >
                {item.text}
              </a>
            ))}
            {user ? (
              filteredMenuPopup.map((item, index) => (
                <a
                  key={index}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                  onClick={item.action}
                >
                  {item.title}
                </a>
              ))
            ) : (
              <>
                <a
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        )}
        <UpgradeOrganizerDialog
          open={openUpgradeDialog}
          onClose={() => setOpenUpgradeDialog(false)}
        />
      </div>
    </div>
  );
};

export default Header;
