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

  useEffect(() => {
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
        console.error("Lỗi khi lấy dữ liệu người dùng:", err);
        setError("Không thể tải dữ liệu người dùng. Vui lòng thử lại.");
        setLoading(false);
      }
    };
    fetchUserData();
    window.scrollTo(0, 0);
  }, []);

  const handleEditClick = () => {
    setOpenEdit(true);
  };

  const closeEdit = () => {
    setOpenEdit(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="text-2xl font-bold text-teal-600 animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="text-xl font-semibold text-red-500 bg-white p-4 rounded-lg shadow-lg">{error}</div>
      </div>
    );
  }

  const [firstName, lastName] = userData.fullName.split(" ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-4 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left Section - Profile Card */}
          <div className="lg:w-1/3 w-full flex">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-teal-500 transform transition-all hover:shadow-2xl hover:-translate-y-1 flex-1 min-h-full">
              <div className="flex justify-center relative">
                <img
                  className="w-36 h-36 rounded-full object-cover border-4 border-teal-100 shadow-lg transform transition-transform hover:scale-105"
                  src="https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                  alt="Profile"
                />
                <div className="absolute inset-0 rounded-full bg-teal-500 opacity-10 blur-xl"></div>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 text-center mt-6 tracking-tight">
                {userData.fullName}
              </h1>
              <h3 className="text-gray-600 text-lg font-semibold text-center mt-2">
                {userData.roles[0]?.name || "Người dùng"}
              </h3>
              <p className="text-gray-500 text-sm text-center mt-3 leading-relaxed">
                Tổ chức: {userData.organizer?.organizerName || "N/A"}
              </p>
              <div className="mt-8 bg-gray-50 rounded-xl p-6 shadow-inner">
                <ul className="space-y-5 text-gray-600">
                  <li className="flex justify-between items-center">
                    <span className="font-medium">Trạng thái</span>
                    <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      Hoạt động
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-medium">Thành viên từ</span>
                    <span className="text-gray-700">07/11/2016</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="lg:w-2/3 w-full flex">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex-1 min-h-full">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-7 w-7 text-teal-500"
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
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">Thông tin</span>
                </div>
                <button
                  onClick={handleEditClick}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <i className="fa-solid fa-user-pen mr-2"></i>Chỉnh sửa
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700 border-b-2 border-gray-100 pb-8">
                {[
                  { label: "Họ", value: firstName },
                  { label: "Tên", value: lastName },
                  { label: "Giới tính", value: userData.gender },
                  { label: "Số điện thoại", value: userData.organizer?.organizerPhone || "N/A" },
                  { label: "Địa chỉ hiện tại", value: userData.address },
                  { label: "Địa chỉ tổ chức", value: userData.organizer?.organizerAddress || "N/A" },
                  {
                    label: "Email",
                    value: (
                      <a href={`mailto:${userData.email}`} className="text-teal-600 hover:text-teal-800 transition-colors">
                        {userData.email}
                      </a>
                    ),
                  },
                  { label: "Ngày sinh", value: userData.birthday },
                  { label: "Website", value: userData.organizer?.organizerWebsite || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 group">
                    <div className="font-semibold text-gray-600 group-hover:text-teal-600 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-gray-700 group-hover:text-gray-900 transition-colors overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <i className="fa-solid fa-users text-teal-600 text-xl"></i>
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">Tổ chức</span>
                </div>
                <ul className="space-y-4">
                  <li className="transform transition-transform hover:translate-x-2">
                    <div className="text-teal-600 font-semibold">{userData.organizer?.organizerName || "N/A"}</div>
                    <div className="text-gray-500 text-sm">Tháng 3/2020 - Hiện tại</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-500">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[85vh] overflow-y-auto transform transition-all duration-500 scale-100 opacity-100 animate-fadeIn">
            <EditProfile onClose={closeEdit} userData={userData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;