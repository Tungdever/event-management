import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
  "https://cdn.evbstatic.com/s3-build/fe/build/images/0205288125d365f93edf9b62837de839-nightlife_desktop.webp",
  "https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp",
  "https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp",
];

const categoriesData = [
  { icon: "fas fa-microphone-alt", label: "Conference" },
  { icon: "fas fa-glass-martini-alt", label: "Nightlife" },
  { icon: "fas fa-theater-masks", label: "Performing" },
  { icon: "fas fa-sun", label: "Holidays" },
  { icon: "fas fa-heart", label: "Dating" },
  { icon: "fas fa-gamepad", label: "Hobbies" },
  { icon: "fas fa-briefcase", label: "Business" },
  { icon: "fas fa-utensils", label: "Food & Drink" },
];

const CategoriesGrid = ({categories}) => {
  const navigate = useNavigate();
  const handleSearchByCategory = async (categoryName) => {
    try {
      categoryName = categoryName.trim().toLowerCase();
      //console.log(categoryName)
      const response = await fetch(
        `http://localhost:8080/api/events/search/by-type/${categoryName}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const events = await response.json();
      navigate(`/list-event-search-by/${categoryName}`, {
        state: { events, categoryName },
      });
      //console.log("list event search by "+ categoryName +" "+events)
    } catch (error) {
      console.error('Error fetching event data:', error);
      alert('Failed to load event data');
    }
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 my-12 py-4">
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col items-center group"
          onClick={() => handleSearchByCategory(category.label)}
        >
          <div className="w-[108px] h-[108px] rounded-full border-2 border-gray-100 flex items-center justify-center hover:border-[ #74CEF7]">
            <i
              className={`${category.icon} text-2xl text-gray-600 group-hover:text-[#3d64ff]`}
            ></i>
          </div>
          <p className="mt-2 text-gray-600 group-hover:text-[#3d64ff]">
            {category.label}
          </p>
        </div>
      ))}
    </div>
  );
};

const SliderEvent = () => {
  return (
    <div className="w-full max-w-[1300px] mx-auto my-[20px] font-roboto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <CategoriesGrid categories={categoriesData} />
    </div>
  );
};

export default SliderEvent;
