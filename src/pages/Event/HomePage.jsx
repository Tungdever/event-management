import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../../components/Header";
import RelatedEvents from "../../components/RelatedEvents";
import "./Detail.css";
import SliderEvent from "../../components/SliderEvent";
import Footer from "../../components/Footer";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import FilterSidebar from "./Search";

const eventData = [
    {
      event_id: 1,
      event_desc: "Đêm nhạc Acoustic với các ca sĩ nổi tiếng",
      event_image: "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
      event_name: "Acoustic Night 2025",
      event_start: "2025-03-15T19:00:00",
    },
    {
      event_id: 2,
      event_desc: "Triển lãm công nghệ tương lai",
      event_image: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F943546153%2F44784881969%2F1%2Foriginal.20250124-034936?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=48139822fb74882c40d4394a200fe8cb",
      event_name: "Future Tech Expo 2025",
      event_start: "2025-04-10T09:00:00",
    },
    {
      event_id: 3,
      event_desc: "Hội nghị startup Việt Nam",
      event_image: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F948712803%2F1270446424833%2F1%2Foriginal.20250130-174429?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=e4aeb3b1e618acdb8695c0a664a9a2aa",
      event_name: "Vietnam Startup Summit 2025",
      event_start: "2025-05-20T10:00:00",
    },
    {
      event_id: 4,
      event_desc: "Lễ hội ẩm thực đường phố",
      event_image: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F962217673%2F2194804563103%2F1%2Foriginal.20250217-082909?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.005&fp-y=0.005&s=dd9fb8c138973a2ad5f05d97fbfc5cba",
      event_name: "Street Food Festival 2025",
      event_start: "2025-06-15T17:00:00",
    },
    {
      event_id: 5,
      event_desc: "Chương trình hài kịch ",
      event_image: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F935015003%2F2247267561273%2F1%2Foriginal.20250114-033532?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=9a91b1db4d680998cdb50300b7aaa2ed",
      event_name: "Comedy Night 2025",
      event_start: "2025-07-05T20:00:00",
    },
    {
      event_id: 6,
      event_desc: "Hội chợ sách quốc tế",
      event_image: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F931200233%2F1581788197543%2F1%2Foriginal.20250109-031109?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=d38b2bd1fd2339fa833b87b3531178f3",
      event_name: "International Book Fair 2025",
      event_start: "2025-08-25T08:00:00",
    },
  ];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white w-full max-w-[1280px] mx-auto px-6 py-2">
      {/* Location Section */}
      <div className="flex items-center space-x-2 relative">
        <span className="text-lg font-semibold">Browsing events in</span>
        <div className="relative">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={handleMouseEnter}
          >
            <span className="font-semibold">Hồ Chí Minh city</span>
            <i className="ml-1 cursor-pointer bi bi-chevron-down"></i>
          </button>

          {/* Submenu */}
          <div
            className={`absolute left-0 top-full mt-1 w-40 bg-white shadow-md border rounded-lg py-2 transition-all duration-200 ${
              isDropdownOpen ? "block" : "hidden"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition duration-150"
            >
              TPHCM
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition duration-150"
            >
              View more
            </a>
          </div>
        </div>
      </div>

      {/* Navbar Menu */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="flex space-x-4 text-[14px]">
          {[
            "All",
            "For you",
            "Online",
            "Today",
            "This weekend",
            "St Patrick's Day",
            "International Women's Day",

            "Free",
            "Music",
            "Food & Drink",
            "Charity & Cause",
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-3 py-1 rounded-md transition duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

const ListEventScroll = ({ events }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-8 py-4 relative">
      <h2 className="text-2xl font-bold text-left mb-4">Upcoming Events</h2>

      <div className="relative">
        <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth">
          {events.map((event, index) => (
            <div key={index} className="flex-none w-72">
              <div className="max-w-[300px] max-h-[350px] bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition duration-300 hover:bg-gray-100 hover:border-gray-200 cursor-pointer">
                <div className="w-[300px] h-[150px] overflow-hidden">
                  <img
                    src={event.event_image}
                    alt={event.event_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {event.event_name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {event.event_start}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                    {event.event_desc}
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <button className="w-full py-2 text-xs font-bold text-blue-gray-900 bg-blue-gray-100 rounded-lg transition hover:bg-blue-gray-200">
                    Organize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white rounded-full p-2 shadow-md"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white rounded-full p-2 shadow-md"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

const ListEventGrid = ({ events }) => {
  return (
    <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 overflow-hidden">
      {events.map((event, index) => (
        <div
  key={index}
  className="max-w-[300px] max-h-[350px] bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition duration-300 hover:bg-gray-100 hover:border-gray-200 cursor-pointer"
>
          <div className="w-[300px] h-[150px] overflow-hidden">
            <img
              src={event.event_image}
              alt={event.event_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {event.event_name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {event.event_start}
            </p>
            <p className="text-sm text-gray-700 mt-2 line-clamp-3">
              {event.event_desc}
            </p>
          </div>
          <div className="p-4 pt-0">
            <button className="w-full py-2 text-xs font-bold text-blue-gray-900 bg-blue-gray-100 rounded-lg transition hover:bg-blue-gray-200">
              Organize
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
const destinations = [
  { name: "Washington", image: "https://storage.googleapis.com/a1aa/image/jqo2dfVUzjKQ7w7hG2Tk_ntPuxynHif31Y49Hrcbc2Q.jpg" },
  { name: "Atlanta", image: "https://storage.googleapis.com/a1aa/image/8iET984xgdbdnXpltDMAlJ_3UT_hpLIXCflhkGaoqkE.jpg" },
  { name: "Dallas", image: "https://storage.googleapis.com/a1aa/image/-21qmRvfsVtdEvxaRgtHVP0Sf8bHgA9NOJAQ9T4grxQ.jpg" },
  { name: "Houston", image: "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg" },
  { name: "Houston", image: "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg" },
  { name: "Houston", image: "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg" },
  { name: "Houston", image: "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg" },
  { name: "Houston", image: "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg" },
];

const popularCities = [
  "Albuquerque", "Abilene", "Austin", "Irvine", "Denver", "Phoenix", "Seattle", 
  "Anaheim", "Nashville", "San Antonio", "Portland", "Detroit", "Baltimore"
];

function TopDestinations() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Top destinations in United States</h1>
      <div className="relative">
        <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth">
          {destinations.map((dest, index) => (
            <div key={index} className="flex-none w-64">
              <div className="relative">
                <img src={dest.image} alt={dest.name} className="rounded-lg w-full h-48 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-transparent p-4 rounded-b-lg">
                  <span className="text-white text-xl font-bold">{dest.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => scroll("left")} className="absolute top-1/2 -translate-y-1/2 left-0 bg-white rounded-full p-2 shadow-md">
          <FaChevronLeft />
        </button>
        <button onClick={() => scroll("right")} className="absolute top-1/2 -translate-y-1/2 right-0 bg-white rounded-full p-2 shadow-md">
          <FaChevronRight />
        </button>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Popular cities</h2>
      <div className="flex flex-wrap gap-4">
        {popularCities.map((city, index) => (
          <a key={index} href="#" className="bg-white rounded-full px-4 py-2 shadow-md text-gray-900 flex items-center space-x-2">
            <span>Things to do in {city}</span>
            <FaExternalLinkAlt />
          </a>
        ))}
      </div>
    </div>
  );
}

const HomePage = () => {
  return (
    <div>
      <Header />
      <SliderEvent />
      <Navbar />
    <ListEventScroll events ={eventData} /> 
    <ListEventGrid events ={eventData} /> 
     <TopDestinations />
      <Footer />

    </div>
  );
};
export default HomePage;
