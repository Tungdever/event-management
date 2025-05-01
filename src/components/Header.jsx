import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../pages/Auth/AuthProvider";
import { api } from "../pages/Auth/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material'; 
const UpgradeOrganizerDialog = ({ open, onClose }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token'); 
  const [showForm, setShowForm] = useState(false); 
  const [formData, setFormData] = useState({
    organizerName: '',
    organizerAddress: '',
    organizerWebsite: '',
    organizerPhone: '',
    organizerDesc:''
  });
  const [errors, setErrors] = useState({
    organizerName: '',
    organizerAddress: '',
    organizerWebsite: '',
    organizerPhone: '',
    organizerDesc:''
  });

  const handleConfirm = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    onClose();
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      organizerName: '',
      organizerAddress: '',
      organizerWebsite: '',
      organizerPhone: '',
      organizerDesc:'',
    };

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
      isValid = false;
    }
    if (!formData.organizerAddress.trim()) {
      newErrors.organizerAddress = 'Organizer address is required';
      isValid = false;
    }
    if (!formData.organizerWebsite.trim()) {
      newErrors.organizerWebsite = 'Organizer website is required';
      isValid = false;
    }
    if (!formData.organizerPhone.trim()) {
      newErrors.organizerPhone = 'Organizer phone is required';
      isValid = false;
    } 
    if (!formData.organizerDesc.trim()) {
      newErrors.organizerDesc = 'Organizer description is required';
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(formData.organizerPhone)) {
      newErrors.organizerPhone = 'Invalid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  
  const handleUpToOrganize = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/user/upgrade-organizer/${user.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert('Upgrade request sent successfully!');
        setShowForm(false);
        onClose(); 
      } else {
        const errorData = await response.json();
        alert(`Failed to upgrade: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error upgrading to organizer:', error);
      alert('An error occurred while upgrading. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {!showForm ? (
        <>
          <DialogTitle>Upgrade to Organizer</DialogTitle>
          <DialogContent>
            <Typography>
              Do you want to upgrade your account to an Organizer role?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              No
            </Button>
            <Button onClick={handleConfirm} color="primary" variant="contained">
              Yes
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Organizer Information</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Organizer Name"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleInputChange}
              error={!!errors.organizerName}
              helperText={errors.organizerName}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Organizer Address"
              name="organizerAddress"
              value={formData.organizerAddress}
              onChange={handleInputChange}
              error={!!errors.organizerAddress}
              helperText={errors.organizerAddress}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Organizer Website"
              name="organizerWebsite"
              value={formData.organizerWebsite}
              onChange={handleInputChange}
              error={!!errors.organizerWebsite}
              helperText={errors.organizerWebsite}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Organizer Phone"
              name="organizerPhone"
              value={formData.organizerPhone}
              onChange={handleInputChange}
              error={!!errors.organizerPhone}
              helperText={errors.organizerPhone}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Organizer Description"
              name="organizerDesc"
              value={formData.organizerDesc}
              onChange={handleInputChange}
              error={!!errors.organizerDesc}
              helperText={errors.organizerDesc}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleUpToOrganize}
              color="primary"
              variant="contained"
            >
              Up to Organizer
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }

    try {
      const normalizedSearchTerm = normalizeVenueName(searchTerm);
      const apiUrl = `http://localhost:8080/api/events/search/by-name-and-city?term=${encodeURIComponent(
        normalizedSearchTerm
      )}&city=${encodeURIComponent(selectedLocation)}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory((prev) => [searchTerm, ...prev.slice(0, 3)]);
      }

      navigate("/search", {
        state: { events: data, searchTerm: normalizedSearchTerm },
      });
    } catch (error) {
      console.error("Error fetching events:", error.message);
      alert(`Failed to search events: ${error.message}`);
    }
  };

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
      <div className="border-l border-gray-300 h-6 mx-4"></div>
      <div className="relative flex items-center px-4">
        <LocationDropdown onLocationChange={setSelectedLocation} />
      </div>
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
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleCreateEventClick = () => {
    navigate("/createEvent");
  };
  const handleHomepage = () => {
    navigate("/");
  };
  const handleLike = () => {
    navigate("/event-like");
  };
  const handleMyTicket = () => {
    navigate("/myticket");
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };
  const handleNoti = () => {
    navigate("/notification");
  };
  const handleLogout = async () => {
    try {
      await api.logout();
      logout();
      alert("Logged out successfully");
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + (error.msg || "Server error"));
    }
  };

  const menuItems = [
    { icon: "bi-calendar4-event", text: "Create event", action: handleCreateEventClick },
    { icon: "bi-heart", text: "Likes", action: handleLike },
    { icon: "bi bi-bell", text: "Noti", action: handleNoti },
  ];

  const menuPopup = [
   
    { title: "Manage my events", action: handleDashboard, roles: ["ORGANIZER"] },
   
    { title: "Tickets", action: handleMyTicket },
  
    { title: "Log out", action: handleLogout },
    {title:"Up to Organizer",action: () => setOpenUpgradeDialog(true), roles: ["ATTENDEE"]}
  ];

  // Lọc menuPopup dựa trên vai trò
  const filteredMenuPopup = menuPopup.filter(
    (item) => !item.roles || item.roles.includes(user?.primaryRole)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow fixed top-0 left-0 w-full z-10">
      <div className="w-full px-4 py-4 h-16 flex justify-between items-center">
        <div
          className="text-red-500 text-xl font-bold ml-4 cursor-pointer hover:text-red-700 transition duration-300"
          onClick={handleHomepage}
        >
          Manage Event
        </div>
        <SearchBar />
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
          <UpgradeOrganizerDialog
        open={openUpgradeDialog}
        onClose={() => setOpenUpgradeDialog(false)}
      />
          <div
            className="relative flex items-center text-gray-500 text-[13px] pl-[20px] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuRef}
            onMouseEnter={() => setIsMenuOpen(true)}
          >
            {user ? (
              <>
                <i className="fa-solid fa-user text-lg"></i>
                <p className="pl-[6px] font-medium">{user.email}</p>
                <i className="bi bi-chevron-down pt-[4px] pl-[3px] cursor-pointer"></i>
                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-[205px] bg-white border rounded shadow-lg z-50"
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    {filteredMenuPopup.map((item, index) => (
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
              </>
            ) : (
              <>
                <a href="/login" className="text-white hover:underline">
                  Login
                </a>
                <a href="/signup" className="text-white hover:underline">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;