import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
  "https://cdn.evbstatic.com/s3-build/fe/build/images/0205288125d365f93edf9b62837de839-nightlife_desktop.webp",
  "https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp",
  "https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp",
];

const SliderEvent = () => {
  return (
    <div className="w-full max-w-[1300px] mx-auto my-[20px]">
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
      
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-8">
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-microphone-alt text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Music
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-glass-martini-alt text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Nightlife
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-theater-masks text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Performing
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-sun text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Holidays
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-heart text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Dating
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-gamepad text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Hobbies
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-briefcase text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Business
        </p>
       </div>
       <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
         <i className="fas fa-utensils text-2xl text-gray-600">
         </i>
        </div>
        <p className="mt-2 text-gray-600">
         Food &amp; Drink
        </p>
       </div>
      </div>
    </div>
  );
};

export default SliderEvent;
