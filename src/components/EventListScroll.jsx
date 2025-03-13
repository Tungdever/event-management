import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useRef } from "react";
const ListEventScroll = ({ events }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-8 py-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-left">Upcoming Events</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="bg-white rounded-full p-2 shadow-sm border border-gray-200"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-white rounded-full p-2 shadow-sm border border-gray-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth"
        >
          {events.map((event, index) => (
            <div key={index} className="flex-none w-72">
              <div className="max-w-[300px] max-h-[500px]   min-h-[440px] bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 transition duration-300 hover:bg-gray-100 hover:border-gray-300 cursor-pointer">
              <img src={event.image} alt={`Event poster for ${event.title}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <p className="text-gray-500">{event.date}</p>
        <p className="text-gray-500">{event.location}</p>
        <p className="text-gray-500">
          {event.price !== "Free" ? `From ` : ""}
          <span className="text-black">{event.price}</span>
        </p>
        <p className="text-gray-500">{event.organizer}</p>
        <p className="text-gray-500">
          <i className="fas fa-users"></i> {event.followers}
        </p>
      </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEventScroll