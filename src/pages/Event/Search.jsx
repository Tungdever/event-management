import { useState } from "react";
import EventList from "../../components/EventListSearch";
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
const Tags = () => {
  const tags = [
    "Online Events",
    "Things To Do Online",
    "Online Networking",
    "Online Health Networking",
    "#support",
    "#supportgroup",
    "#anxietyrelief",
    "#support_group",
    "#anxiety_relief",
    "#anxiety_support",
    "#anxiety_support_group",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState(["workshop"]);
  const [selectedEventType, setSelectedEventType] = useState("all-types");
  const [selectedEventSize, setSelectedEventSize] = useState("all-sizes");

  const eventCategories = [
    { id: "conference", label: "Hội nghị (30)" },
    { id: "workshop", label: "Workshop (22)" },
    { id: "seminar", label: "Hội thảo (17)" },
    { id: "concert", label: "Concert / Âm nhạc (15)" },
    { id: "exhibition", label: "Triển lãm (11)" },
  ];

  const eventTypes = [
    { id: "all-types", label: "Tất cả" },
    { id: "free", label: "Miễn phí" },
    { id: "paid", label: "Trả phí" },
    { id: "online", label: "Trực tuyến" },
    { id: "offline", label: "Trực tiếp" },
  ];

  const eventSizes = [
    { id: "all-sizes", label: "Tất cả" },
    { id: "small", label: "Quy mô nhỏ (dưới 100 người)" },
    { id: "medium", label: "Quy mô vừa (100 - 500 người)" },
    { id: "large", label: "Quy mô lớn (trên 500 người)" },
  ];

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedEventType("all-types");
    setSelectedEventSize("all-sizes");
  };

  return (
    <div className="w-full bg-white p-5 rounded shadow border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Bộ lọc sự kiện</h2>
        <button
          onClick={resetFilters}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Xóa lọc ({selectedCategories.length})
        </button>
      </div>

      {/* Danh mục sự kiện */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Loại sự kiện</h3>
        <div className="space-y-2">
          {eventCategories.map((category) => (
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
      </div>

      {/* Hình thức sự kiện */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Hình thức</h3>
        <div className="space-y-2">
          {eventTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <input
                id={type.id}
                type="radio"
                name="eventType"
                checked={selectedEventType === type.id}
                onChange={() => setSelectedEventType(type.id)}
                className="accent-blue-500 w-4 h-4"
              />
              <label
                htmlFor={type.id}
                className="text-gray-600 cursor-pointer hover:text-blue-600"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Quy mô sự kiện */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Quy mô sự kiện</h3>
        <div className="space-y-2">
          {eventSizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2">
              <input
                id={size.id}
                type="radio"
                name="eventSize"
                checked={selectedEventSize === size.id}
                onChange={() => setSelectedEventSize(size.id)}
                className="accent-purple-500 w-4 h-4"
              />
              <label
                htmlFor={size.id}
                className="text-gray-600 cursor-pointer hover:text-purple-600"
              >
                {size.label}
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
          <EventList event={eventData} />
          <Tags />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
