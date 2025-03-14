import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([
    "Music Festival",
    "Tech Conference",
    "Art Exhibition",
    "Sports Event",
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef(null);

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

  return (
    <div className="relative flex items-center bg-white rounded-full border p-2 w-full max-w-2xl text-[13px] h-[40px]" ref={searchRef}>
      <div className="flex items-center px-4 w-[380px]">
        <i className="fas fa-search text-gray-500"></i>
        <input
          type="text"
          placeholder="Search events"
          className="ml-2 outline-none text-gray-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowHistory(true)}
        />
      </div>
      {showHistory && (
        <div className="absolute top-full left-10 w-[366px] bg-white border rounded shadow-lg z-50">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(item);
                setShowHistory(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="border-l border-gray-300 h-6 mx-4"></div>

      <div className="relative flex items-center px-4">
        <i className="fas fa-map-marker-alt text-gray-500 cursor-pointer" onClick={() => setShowHistory(!showHistory)}></i>
        <select className="ml-2 text-gray-500 bg-transparent outline-none">
          <option value="Ho Chi Minh City">Ho Chi Minh City</option>
          <option value="Hanoi">Hanoi</option>
          <option value="Da Nang">Da Nang</option>
        </select>
      </div>

      <button className="ml-auto bg-red-600 text-white rounded-full px-2 py-1 hover:bg-red-700"
      onClick={() => navigate("/search")}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); 

  
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
    <div className="bg-white shadow relative">
      <div className="w-full px-4 py-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="text-red-500 text-xl font-bold ml-4 cursor-pointer hover:text-red-700 transition duration-300">
          Manage Event
        </div>
        <SearchBar/>


        {/* Navigation Menu */}
        <div className="flex items-center gap-6 mx-4">
          {[
            { icon: "bi-calendar4-event", text: "Create event" },
          
            { icon: "bi bi-heart", text: "Likes" },
            { icon: "bi bi-question-circle", text: "Help" },
          ].map((item, index) => (
            <a
              key={index}
              href={"https://www.eventbrite.com/"}
              className="flex flex-col items-center text-gray-500 text-[13px] font-medium px-[20px] cursor-pointer hover:text-blue-500 transition duration-300"
            >
              <i className={`${item.icon} text-lg`}></i>
              {item.text}
            </a>
          ))}

          {/* User Profile */}
          <div
            className="relative flex items-center text-gray-500 text-[13px] pl-[20px] cursor-pointer "
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuRef} // Gán ref vào menu
            onMouseEnter={() => setIsMenuOpen(true)} // Hover vào mũi tên thì mở submenu
          >
            <i className="fa-solid fa-user text-lg"></i>
            <p className="pl-[6px] font-medium">trungbo.234416@gmail.com</p>
            <i
              className="bi bi-chevron-down pt-[4px] pl-[3px] cursor-pointer"
             
            ></i>

            {/* Submenu */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-[205px] bg-white border rounded shadow-lg z-50"
                onMouseLeave={() => setIsMenuOpen(false)} // Rời chuột khỏi submenu thì đóng
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
                    href="#"
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
