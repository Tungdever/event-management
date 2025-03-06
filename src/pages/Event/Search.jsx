import { useState } from "react";
import EventList from "../../components/EventList";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
const eventData = [
  {
    event_id: 1,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 2,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 3,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 4,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 5,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
];

const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState([
    "software-testing",
  ]);
  const [selectedExperience, setSelectedExperience] = useState("no-experience");
  const [selectedLevel, setSelectedLevel] = useState("all-levels");

  const categories = [
    { id: "software-engineering", label: "Software Engineering (30)" },
    { id: "sales-it", label: "Sales IT Phần mềm (22)" },
    { id: "design", label: "Thiết kế Đồ họa/Giao diện/Trải nghiệm (17)" },
    { id: "advertising", label: "Quảng cáo/Sáng tạo (15)" },
    { id: "software-testing", label: "Software Testing (11)" },
  ];

  const experienceOptions = [
    { id: "all-experience", label: "Tất cả" },
    { id: "no-experience", label: "Không yêu cầu" },
    { id: "less-than-1-year", label: "Dưới 1 năm" },
    { id: "1-year", label: "1 năm" },
    { id: "2-years", label: "2 năm" },
    { id: "3-years", label: "3 năm" },
    { id: "4-years", label: "4 năm" },
    { id: "5-years", label: "5 năm" },
    { id: "more-than-5-years", label: "Trên 5 năm" },
  ];

  const levelOptions = [
    { id: "all-levels", label: "Tất cả" },
    { id: "employee", label: "Nhân viên" },
    { id: "team-leader", label: "Trưởng nhóm" },
    { id: "manager", label: "Trưởng/Phó phòng" },
  ];

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedExperience("all-experience");
    setSelectedLevel("all-levels");
  };

  return (
    <div className="w-full  bg-white p-5 rounded-2xl shadow-lg border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Lọc nâng cao</h2>
        <button
          onClick={resetFilters}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Xóa lọc ({selectedCategories.length})
        </button>
      </div>

      {/* Danh mục nghề */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Theo danh mục nghề</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <input
                id={category.id}
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="accent-green-500 w-4 h-4"
              />
              <label
                htmlFor={category.id}
                className="text-gray-600 cursor-pointer hover:text-green-600"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
        <button className="mt-3 text-green-500 hover:text-green-600 font-medium">
          Xem thêm
        </button>
      </div>

      {/* Kinh nghiệm */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Kinh nghiệm</h3>
        <div className="space-y-2">
          {experienceOptions.map((exp) => (
            <div key={exp.id} className="flex items-center space-x-2">
              <input
                id={exp.id}
                type="radio"
                name="experience"
                checked={selectedExperience === exp.id}
                onChange={() => setSelectedExperience(exp.id)}
                className="accent-blue-500 w-4 h-4"
              />
              <label
                htmlFor={exp.id}
                className="text-gray-600 cursor-pointer hover:text-blue-600"
              >
                {exp.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Cấp bậc */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Cấp bậc</h3>
        <div className="space-y-2">
          {levelOptions.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <input
                id={level.id}
                type="radio"
                name="level"
                checked={selectedLevel === level.id}
                onChange={() => setSelectedLevel(level.id)}
                className="accent-purple-500 w-4 h-4"
              />
              <label
                htmlFor={level.id}
                className="text-gray-600 cursor-pointer hover:text-purple-600"
              >
                {level.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <>
      <Header />
      <div class=" mx-auto px-6 py-4">
        <nav class="text-sm text-blue-600 space-x-2 pt-2">
          <a href="#" class="hover:underline">
            Home
          </a>
          <span>/</span>
          <a href="#" class="hover:underline">
            Vietnam
          </a>
          <span>/</span>
          <a href="#" class="hover:underline">
            Ho Chi Minh
          </a>
          <span>/</span>
          <span class="text-gray-500">Live Music Events</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-700 mt-4">
          Live music events in Ho Chi Minh, Vietnam
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-6 p-5">
        <div className="w-full md:w-1/4">
          <FilterSidebar />
        </div>

        <div className="w-full md:w-3/4">
          <EventList event={eventData} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
