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
        const response = await axios.get(`http://localhost:8080/api/auth/user/${user.email}`,{
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
  }, []);

  const handleEditClick = () => {
    setOpenEdit(true);
  };

  const closeEdit = () => {
    setOpenEdit(false);
  };

  if (loading) {
    return <div className="container mx-auto my-5 p-5">Đang tải...</div>;
  }

  if (error) {
    return <div className="container mx-auto my-5 p-5 text-red-500">{error}</div>;
  }

  // Tách fullName thành firstName và lastName để hiển thị
  const [firstName, lastName] = userData.fullName.split(" ");

  return (
    <div className="container mx-auto my-5 p-5">
      <div className="md:flex no-wrap md:-mx-2">
        {/* Phần bên trái */}
        <div className="w-full md:w-3/12 md:mx-2">
          {/* Thẻ hồ sơ */}
          <div className="bg-white p-3 border-t-4 border-green-400">
            <div className="image overflow-hidden">
              <img
                className="h-auto w-full mx-auto"
                src="https://i.pinimg.com/474x/07/35/83/07358323a240bca02a4b204a538c1939.jpg"
                alt=""
              />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{userData.fullName}</h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">
              {userData.roles[0]?.name || "Người dùng"}
            </h3>
            <p className="text-sm text-gray-500 hover:text-gray-600 leading-6 text-justify">
              Tổ chức: {userData.organizer?.organizerName || "N/A"}
            </p>
            <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li className="flex items-center py-3">
                <span>Trạng thái</span>
                <span className="ml-auto">
                  <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">Hoạt động</span>
                </span>
              </li>
              <li className="flex items-center py-3">
                <span>Thành viên từ</span>
                <span className="ml-auto">07/11/2016</span>
              </li>
            </ul>
          </div>
          <div className="my-4"></div>
        </div>
        {/* Phần bên phải */}
        <div className="w-full md:w-9/12 mx-2 h-64">
          {/* Phần thông tin */}
          <div className="bg-white p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 justify-between">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
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
                </span>
                <span className="tracking-wide">Thông tin</span>
              </div>
              <i className="fa-solid fa-user-pen hover:text-orange-500" onClick={handleEditClick}></i>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm pb-8 border-b-4">
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
                      <a href={`mailto:${userData.email}`} className="text-blue-800">
                        {userData.email}
                      </a>
                    ),
                  },
                  { label: "Ngày sinh", value: userData.birthday },
                  { label: "Website", value: userData.organizer?.organizerWebsite || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{item.label}</div>
                    <div className="px-4 py-2">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="my-4"></div>
            {/* Kinh nghiệm và học vấn */}
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <i className="fa-solid fa-users text-teal-600"></i>
                    <span className="tracking-wide">Tổ chức</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div className="text-teal-600">{userData.organizer?.organizerName || "N/A"}</div>
                      <div className="text-gray-500 text-xs">Tháng 3/2020 - Hiện tại</div>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                          fill="#fff"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 XXX 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Học vấn</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div className="text-teal-600">Thạc sĩ tại Oxford</div>
                      <div className="text-gray-500 text-xs">Tháng 3/2020 - Hiện tại</div>
                    </li>
                    <li>
                      <div className="text-teal-600">Cử nhân tại LPU</div>
                      <div className="text-gray-500 text-xs">Tháng 3/2020 - Hiện tại</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Thẻ bạn bè */}
          <div className="bg-white p-3 hover:shadow">
            <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
              <span className="text-green-500">
                <svg
                  className="h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>
              <span>Bạn bè</span>
            </div>
            <div className="grid grid-cols-8">
              {[
                {
                  name: "Kojstantin",
                  img: "https://cdn.australianageingagenda.com.au/wp-content/uploads/2015/06/28085920/Phil-Beckett-2-e1435107243361.jpg",
                },
                { name: "James", img: "https://avatars2.githubusercontent.com/u/24622175?s=60&v=4" },
                {
                  name: "Natie",
                  img: "https://i.pinimg.com/736x/a6/16/28/a6162845747ab6f081706e9a00552a13.jpg",
                },
                {
                  name: "Casey",
                  img: "https://i.pinimg.com/736x/12/49/51/1249511d06c783b0c29b7785c3fa970c.jpg",
                },
                {
                  name: "Yeah",
                  img: "https://i.pinimg.com/474x/40/58/5e/40585ed70ad58c4f1c85361345045e1f.jpg",
                },
                {
                  name: "Yami",
                  img: "https://i.pinimg.com/474x/b3/25/f6/b325f69e199b6d6e8d6808129e6d7aa9.jpg",
                },
                {
                  name: "Yahoo",
                  img: "https://i.pinimg.com/736x/81/ec/02/81ec02c841e7aa13d0f099b5df02b25c.jpg",
                },
              ].map((friend) => (
                <div key={friend.name} className="text-center my-2">
                  <img className="h-16 w-16 rounded-full mx-auto" src={friend.img} alt="" />
                  <a href="#" className="text-main-color">
                    {friend.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {openEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-2 rounded shadow-lg w-3/5 overflow-y-auto h-[620px]">
            <EditProfile onClose={closeEdit} userData={userData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;