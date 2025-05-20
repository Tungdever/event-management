import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProfile from "./EditProfile";
import { useAuth } from "../Auth/AuthProvider";

const ViewProfile = () => {
  const [userData, setUserData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/user/${user.email}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Unable to load user data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    window.scrollTo(0, 0);
  }, []);

  const handleEditClick = () => {
    setOpenEdit(true);
  };

  const closeEdit = () => {
    setOpenEdit(false);
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="text-sm sm:text-base md:text-lg font-semibold text-red-500 bg-white p-3 sm:p-4 rounded-lg shadow-lg max-w-[90%] text-center">
          {error}
        </div>
      </div>
    );
  }

  // Hàm định dạng ngày sinh theo chuẩn MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Not Updated";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Tách fullName thành firstName và lastName
  const [firstName, ...lastNameParts] = userData.fullName.split(" ");
  const lastName = lastNameParts.join(" ") || "Not Updated";

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-4 sm:py-6 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {/* Left Section - Profile Card */}
          <div className="lg:w-1/3 w-full flex">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 border-t-4 border-teal-500 transform transition-all hover:shadow-2xl hover:-translate-y-1 flex-1">
              <div className="flex justify-center relative">
                <img
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-teal-100 shadow-md transform transition-transform hover:scale-105"
                  src={userData.organizer?.organizerLogo || "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"}
                  alt="Profile"
                />
                <div className="absolute inset-0 rounded-full bg-teal-500 opacity-10 blur-xl"></div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 text-center mt-4 sm:mt-6 tracking-tight">
                {userData.fullName}
              </h1>
              <h3 className="text-gray-600 text-sm sm:text-base md:text-lg font-semibold text-center mt-2">
                {userData.roles?.[0]?.name || "User"}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm text-center mt-2 sm:mt-3 leading-relaxed">
                {userData.organizer?.organizerName || "Not an Organizer"}
              </p>
              <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-inner">
                <ul className="space-y-3 sm:space-y-4 text-gray-600 text-xs sm:text-sm">
                  <li className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <span
                      className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow ${
                        userData.active ? "bg-teal-500 text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      {userData.active ? "Active" : "Inactive"}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-medium">User ID</span>
                    <span className="text-gray-700">{userData.userId}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="lg:w-2/3 w-full flex">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7 text-teal-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                    Personal Information
                  </span>
                </div>
                <button
                  onClick={handleEditClick}
                  className="mt-3 sm:mt-0 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <i className="fa-solid fa-user-pen mr-1 sm:mr-2"></i>Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-700 border-b-2 border-gray-100 pb-6 sm:pb-8">
                {[
                  { label: "First Name", value: firstName },
                  { label: "Last Name", value: lastName },
                  { label: "Gender", value: userData.gender || "Not Updated" },
                  { label: "Birthday", value: formatDate(userData.birthday) },
                  { label: "Address", value: userData.address || "Not Updated" },
                  {
                    label: "Email",
                    value: (
                      <a
                        href={`mailto:${userData.email}`}
                        className="text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        {userData.email}
                      </a>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 group">
                    <div className="font-semibold text-gray-600 group-hover:text-teal-600 transition-colors text-sm sm:text-base">
                      {item.label}
                    </div>
                    <div className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              {userData.organizer && (
                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <i className="fa-solid fa-users text-teal-600 text-lg sm:text-xl"></i>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                      Organizational Information
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-700">
                    {[
                      { label: "Organization Name", value: userData.organizer.organizerName },
                      { label: "Address", value: userData.organizer.organizerAddress },
                      {
                        label: "Website",
                        value: (
                          <a
                            href={userData.organizer.organizerWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-800 transition-colors"
                          >
                            {userData.organizer.organizerWebsite}
                          </a>
                        ),
                      },
                      { label: "Phone Number", value: userData.organizer.organizerPhone },
                      { label: "Description", value: userData.organizer.organizerDesc },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1 group">
                        <div className="font-semibold text-gray-600 group-hover:text-teal-600 transition-colors text-sm sm:text-base">
                          {item.label}
                        </div>
                        <div className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-500">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-[95%] sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto transform transition-all duration-500 scale-100 opacity-100 animate-fadeIn">
            <EditProfile onClose={closeEdit} userData={userData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;