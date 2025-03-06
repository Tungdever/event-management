import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Tham chiếu đến vùng menu

  // Đóng menu khi click ra ngoài
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
        <div className="text-red-500 text-2xl font-bold ml-4 cursor-pointer hover:text-red-700 transition duration-300">
          Manage Event
        </div>

        {/* Search Box */}
        <div className="flex items-center border w-80 focus-within:border-indigo-500 transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[38px] rounded-[5px] overflow-hidden">
          <input
            type="text"
            placeholder="Search event"
            className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
          />
          <i className="bi bi-search text-gray-500"></i>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6 mx-4">
          {[
            { icon: "bi-calendar4-event", text: "Create event" },
            { icon: "bi-ticket-perforated", text: "Ticket" },
            { icon: "fa-regular fa-heart", text: "Likes" },
            { icon: "bi bi-question-circle", text: "Help" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-gray-500 text-[14px] px-[20px] cursor-pointer hover:text-blue-500 transition duration-300"
            >
              <i className={item.icon}></i>
              {item.text}
            </div>
          ))}

          {/* User Profile */}
          <div
            className="relative flex items-center text-gray-500 text-[14px] pl-[20px] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuRef} // Gán ref vào menu
          >
            <i className="fa-solid fa-user"></i>
            <p className="pl-[6px]">trungbo.234416@gmail.com</p>
            <i
              className="bi bi-chevron-down pt-[4px] pl-[3px] cursor-pointer"
              onMouseEnter={() => setIsMenuOpen(true)} // Hover vào mũi tên thì mở submenu
            ></i>

            {/* Submenu */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-lg z-50"
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
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
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
