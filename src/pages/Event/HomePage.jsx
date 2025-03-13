import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../../components/Header";

import "./Detail.css";
import SliderEvent from "../../components/SliderEvent";
import Footer from "../../components/Footer";
import { useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import EventListings from "../../components/EventListGrid";
import ListEventScroll from "../../components/EventListScroll";

const eventData =  [
  {
    id: 1,
    title: "2025 EB-5 & Global Immigration Expo Vietnam",
    date: "Tomorrow • 9:00 AM",
    location: "The Reverie Saigon",
    price: "$3,405.80",
    organizer: "Uglobal Immigration Magazine/EB5 Investors Magazine",
    followers: "1k followers",
    image: "https://storage.googleapis.com/a1aa/image/7Ayi17NC009F_mgUBPq9U6d7dzejFLR_aA_t4fengnY.jpg",
  },
  {
    id: 2,
    title: "SGN Satay Socials 5th to 10th Edition",
    date: "Friday • 6:00 PM",
    location: "The Sentry P",
    price: "Free",
    organizer: "Reactor School",
    followers: "74 followers",
    image: "https://storage.googleapis.com/a1aa/image/CRYJ9pmm-EoCg4hN2hn0yVXPJHmT4SjvqQZDqwgSce8.jpg",
  },
  {
    id: 3,
    title: "Biogas & Biomass Bioenergy Asia Summit 2025 Vietnam Focus",
    date: "Wed, Mar 19 • 9:00 AM",
    location: "Hồ Chí Minh, 胡志明区越南",
    price: "Free",
    organizer: "INBC Global",
    followers: "33 followers",
    image: "https://storage.googleapis.com/a1aa/image/hwWfrUORRiBUJ749Um2ZrzVqZ7nqFnG-acijHPDNehk.jpg",
  },
  {
    id: 4,
    title: "ĐÁNH THỨC SỰ GIÀU CÓ 69-Tp.HCM (20,21,22/03/2025)",
    date: "Thu, Mar 20 • 8:00 AM",
    location: "Grand Palace Wedding And Convention",
    price: "$25.64",
    organizer: "Luật sư PHẠM THÀNH LONG",
    followers: "8k followers",
    image: "https://storage.googleapis.com/a1aa/image/Hrz4249BwevqLxiKfv8yiZx-T2Exu_I0LKlYB24ge_c.jpg",
  },
  {
    id: 5,
    title: "ĐÁNH THỨC SỰ GIÀU CÓ 69-Tp.HCM (20,21,22/03/2025)",
    date: "Thu, Mar 20 • 8:00 AM",
    location: "Grand Palace Wedding And Convention",
    price: "$25.64",
    organizer: "Luật sư PHẠM THÀNH LONG",
    followers: "8k followers",
    image: "https://storage.googleapis.com/a1aa/image/Hrz4249BwevqLxiKfv8yiZx-T2Exu_I0LKlYB24ge_c.jpg",
  },
  {
    id: 6,
    title: "ĐÁNH THỨC SỰ GIÀU CÓ 69-Tp.HCM (20,21,22/03/2025)",
    date: "Thu, Mar 20 • 8:00 AM",
    location: "Grand Palace Wedding And Convention",
    price: "$25.64",
    organizer: "Luật sư PHẠM THÀNH LONG",
    followers: "8k followers",
    image: "https://storage.googleapis.com/a1aa/image/Hrz4249BwevqLxiKfv8yiZx-T2Exu_I0LKlYB24ge_c.jpg",
  },
];
const Navbar = () => {
  const [selectedLocation, setSelectedLocation] = useState("Hồ Chí Minh");
  const [selectedMenu, setSelectedMenu] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const locations = [
    "Hồ Chí Minh ",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
  ];

  return (
    <div className="bg-white w-full max-w-[1280px] mx-auto px-6 py-2">
      {/* Location Section */}
      <div className="flex items-center space-x-2 relative ">
        <span className="text-lg font-semibold">Browsing events in</span>
        <div className="relative inline-block">
          <button
            className="text-blue-800 font-semibold rounded-md px-4 py-1 bg-white  flex items-center justify-start w-[180px]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedLocation}
            <i className="bi bi-chevron-down ml-2 text-blue-800 "></i>
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-1 w-[180px] bg-white shadow-lg border rounded-lg py-2 z-10">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-blue-100 transition duration-200 ${
                    selectedLocation === location
                      ? "text-blue-800 font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedLocation(location);
                    setIsDropdownOpen(false);
                  }}
                >
                  {location}
                  {selectedLocation === location && (
                    <i className="bi bi-check text-blue-800"></i>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navbar Menu */}
      <div className="mt-4 border-t border-gray-200 pt-4 pb-2">
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
              onClick={() => setSelectedMenu(item)}
              className={`px-3 py-1  transition duration-200 ${
                selectedMenu === item
                  ? "text-blue-800 font-bold border-b-2 border-blue-800"
                  : "text-gray-600 hover:text-gray-900 hover:underline"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

const destinations = [
  {
    name: "Washington",
    image:
      "https://storage.googleapis.com/a1aa/image/jqo2dfVUzjKQ7w7hG2Tk_ntPuxynHif31Y49Hrcbc2Q.jpg",
  },
  {
    name: "Atlanta",
    image:
      "https://storage.googleapis.com/a1aa/image/8iET984xgdbdnXpltDMAlJ_3UT_hpLIXCflhkGaoqkE.jpg",
  },
  {
    name: "Dallas",
    image:
      "https://storage.googleapis.com/a1aa/image/-21qmRvfsVtdEvxaRgtHVP0Sf8bHgA9NOJAQ9T4grxQ.jpg",
  },
  {
    name: "Houston",
    image:
      "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg",
  },
  {
    name: "Houston",
    image:
      "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg",
  },
  {
    name: "Houston",
    image:
      "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg",
  },
  {
    name: "Houston",
    image:
      "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg",
  },
  {
    name: "Houston",
    image:
      "https://storage.googleapis.com/a1aa/image/Nk-hpgR3cc2Eki5Fj2ZeElISiSJalWpQzajxEqGZusY.jpg",
  },
];

const popularCities = [
  "Albuquerque",
  "Abilene",
  "Austin",
  "Irvine",
  "Denver",
  "Phoenix",
  "Seattle",
  "Anaheim",
  "Nashville",
  "San Antonio",
  "Portland",
  "Detroit",
  "Baltimore",
];

const TopDestinations = () => {
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
    <div className="bg-gray-50 text-gray-900 container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Top destinations in United States
      </h1>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth"
        >
          {destinations.map((dest, index) => (
            <div key={index} className="flex-none w-64">
              <div className="relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-transparent p-4 rounded-b-lg">
                  <span className="text-white text-xl font-bold">
                    {dest.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white rounded-full p-2 shadow-sm"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white rounded-full p-2 shadow-sm"
        >
          <FaChevronRight />
        </button>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Popular cities</h2>
      <div className="flex flex-wrap gap-4">
        {popularCities.map((city, index) => (
          <a
            key={index}
            href="#"
            className="bg-white rounded-full px-4 py-2 shadow-sm text-gray-900 flex items-center space-x-2"
          >
            <span>Things to do in {city}</span>
            <FaExternalLinkAlt />
          </a>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      <Header />
      <SliderEvent />
      <Navbar />
      <ListEventScroll events={eventData} />
      <EventListings/>
      <TopDestinations />
      <Footer />
    </div>
  );
};
export default HomePage;
