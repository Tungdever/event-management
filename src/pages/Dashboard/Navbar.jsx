import { FaBell, FaEnvelope } from "react-icons/fa";
import { RiMenuLine } from "react-icons/ri";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../Auth/api";
import { useAuth } from "../Auth/AuthProvider";
const Navbar = () => {
  
  return (
    <div className="py-2 px-6 bg-[#f8f4f3] flex items-center shadow shadow-black/5 sticky top-0 left-0 z-30 h-[45px]">
      <button type="button" className="text-xl text-gray-900 font-semibold">
        <RiMenuLine />
      </button>

      {/* Ô tìm kiếm */}
      {/* <div className="ml-6 relative flex-grow">
        <input
          type="text"
          className="w-full max-w-xs py-2 px-4 bg-gray-50 outline-none border border-gray-300 rounded-md text-sm focus:border-blue-500"
          placeholder="Search..."
        />
      </div> */}
      
      <ul className="ml-auto flex items-center space-x-6">
        {/* <Dropdown icon={<FaBell />} count={5}>
          <NotificationItem title="New order" description="from a user" />
          <NotificationItem title="System update" description="Check your dashboard" />
        </Dropdown>
        <Dropdown icon={<FaEnvelope />} count={2}>
          <NotificationItem title="John Doe" description="Hello there!" />
          <NotificationItem title="Jane Smith" description="Meeting at 3 PM" />
        </Dropdown> */}
        <ProfileDropdown />
      </ul>
    </div>
  );
};

const Dropdown = ({ icon, count, children }) => {
  return (
    <div className="relative group">
      <button className="relative p-2 rounded-full hover:bg-gray-300 transition-all duration-200">
        {icon}
        {count > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {/* Submenu hiển thị khi hover */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 pt-2 pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

const NotificationItem = ({ title, description }) => {
  return (
    <div className="p-2 hover:bg-gray-50 flex items-center transition-all duration-200 cursor-pointer">
      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded-full" />
      <div className="ml-2">
        <div className="text-[13px] text-gray-600 font-medium truncate hover:text-blue-500 transition-all duration-200">
          {title}
        </div>
        <div className="text-[11px] text-gray-400">{description}</div>
      </div>
    </div>
  );
};

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.logout();
      logout();
      alert('Logged out successfully');
      navigate('/login');
    } catch (error) {
      alert('Logout failed: ' + (error.msg || 'Server error'));
    }
  };
  return (
    <div className="relative group">
      <div className="flex items-center space-x-4">
          {user ? (
            <>
            <i className="fa-solid fa-user text-lg"></i>
              <span className="text-[12px]">{user.email}</span>
              {/* {user.roles.includes('ROLE_ADMIN') && (
                <a href="/dashboard" className="text-white hover:underline">Admin Dashboard</a>
              )} */}
             
            </>
          ) : (
            <>
              <a href="/login" className="text-white hover:underline">Login</a>
              <a href="/signup" className="text-white hover:underline">Sign Up</a>
            </>
          )}
        </div>

      <ul className="absolute right-0 mt-2 w-40 py-1.5 bg-white rounded-md shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 pt-2 pointer-events-auto">
        <li>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-all duration-200">
           Main dashboard
          </a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-all duration-200">
            Settings
          </a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-all duration-200" onClick={handleLogout}>
            Log Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
