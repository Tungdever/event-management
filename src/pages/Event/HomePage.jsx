import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
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
import Loader from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
const eventData = [
  {
    id: 1,
    title: "2025 EB-5 & Global Immigration Expo Vietnam",
    date: "Tomorrow • 9:00 AM",
    location: "The Reverie Saigon",
    price: "$3,405.80",
    organizer: "Uglobal Immigration Magazine/EB5 Investors Magazine",
    followers: "1k followers",
    image:
      "https://storage.googleapis.com/a1aa/image/7Ayi17NC009F_mgUBPq9U6d7dzejFLR_aA_t4fengnY.jpg",
  },
  {
    id: 2,
    title: "SGN Satay Socials 5th to 10th Edition",
    date: "Friday • 6:00 PM",
    location: "The Sentry P",
    price: "Free",
    organizer: "Reactor School",
    followers: "74 followers",
    image:
      "https://storage.googleapis.com/a1aa/image/CRYJ9pmm-EoCg4hN2hn0yVXPJHmT4SjvqQZDqwgSce8.jpg",
  },
  {
    id: 3,
    title: "Biogas & Biomass Bioenergy Asia Summit 2025 Vietnam Focus",
    date: "Wed, Mar 19 • 9:00 AM",
    location: "Hồ Chí Minh, 胡志明区越南",
    price: "Free",
    organizer: "INBC Global",
    followers: "33 followers",
    image:
      "https://storage.googleapis.com/a1aa/image/hwWfrUORRiBUJ749Um2ZrzVqZ7nqFnG-acijHPDNehk.jpg",
  },
  {
    id: 4,
    title: "ĐÁNH THỨC SỰ GIÀU CÓ 69-Tp.HCM (20,21,22/03/2025)",
    date: "Thu, Mar 20 • 8:00 AM",
    location: "Grand Palace Wedding And Convention",
    price: "$25.64",
    organizer: "Luật sư PHẠM THÀNH LONG",
    followers: "8k followers",
    image:
      "https://storage.googleapis.com/a1aa/image/Hrz4249BwevqLxiKfv8yiZx-T2Exu_I0LKlYB24ge_c.jpg",
  },
  {
    id: 5,
    title: "ĐÁNH THỨC SỰ GIÀU CÓ 69-Tp.HCM (20,21,22/03/2025)",
    date: "Thu, Mar 20 • 8:00 AM",
    location: "Grand Palace Wedding And Convention",
    price: "$25.64",
    organizer: "Luật sư PHẠM THÀNH LONG",
    followers: "8k followers",
    image:
      "https://storage.googleapis.com/a1aa/image/Hrz4249BwevqLxiKfv8yiZx-T2Exu_I0LKlYB24ge_c.jpg",
  },
  {
    id: 6,
    title: "ĐÁNH THỨC SỰ GIÀU CÓ 69-Tp.HCM (20,21,22/03/2025)",
    date: "Thu, Mar 20 • 8:00 AM",
    location: "Grand Palace Wedding And Convention",
    price: "$25.64",
    organizer: "Luật sư PHẠM THÀNH LONG",
    followers: "8k followers",
    image:
      "https://storage.googleapis.com/a1aa/image/Hrz4249BwevqLxiKfv8yiZx-T2Exu_I0LKlYB24ge_c.jpg",
  },
];
const popularCities = [
  { key: "ho-chi-minh", name: "Tp.Hồ Chí Minh" , image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg",},
  { key: "ha-noi", name: "Hà Nội" , image: "https://tse4.mm.bing.net/th?id=OIP.TG6asWNB6eXi1qmyBhK0MgHaE8&pid=Api",},
  { key: "da-nang", name: "Đà Nẵng",image:"https://tse3.mm.bing.net/th?id=OIP.-VeJDm4d4pGItJ2dW1sPhwHaEW&pid=Api", },
  { key: "hoi-an", name: "Hội An" ,image:"https://tse1.mm.bing.net/th?id=OIP.yaHI0xalsVOhjJrMLgwd0gHaEj&pid=Api",},
  { key: "nha-trang", name: "Nha Trang",image:"https://tse3.mm.bing.net/th?id=OIP.lmOSh4__DVScQiGPX_z8gAHaE7&pid=Api", },
  { key: "da-lat", name: "Đà Lạt",image:"https://tse1.mm.bing.net/th?id=OIP.28LZalVpUhcZFkoxUzgPSAHaFj&pid=Api", },
  { key: "hue", name: "Huế" ,image:"https://tse2.mm.bing.net/th?id=OIP.GjTvs6qKXyVBVqZEr_28xgHaJQ&pid=Api",},
  { key: "phu-quoc", name: "Phú Quốc" ,image: "https://tse3.mm.bing.net/th?id=OIP.iD5WJa5kTTqnP83rCyg72QHaE7&pid=Api",},
  { key: "sa-pa", name: "Sa Pa",image:"https://tse3.mm.bing.net/th?id=OIP.vhiR4v7kpNaiZ2JBTogiewHaE8&pid=Api", },
  { key: "can-tho", name: "Cần Thơ",image: "https://tse3.mm.bing.net/th?id=OIP.3QDMqoVp2iw0o9c82hgDQgHaEK&pid=Api", },
  { key: "haiphong", name: "Hải Phòng",image:"https://tse2.mm.bing.net/th?id=OIP.5LC-cqmLjYiCVWjENF7hbAHaFK&pid=Api", },

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

const TopDestinations = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate()
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
  
  const handleSearchByCity = async(city) =>{
    try{
      const cityName = city.trim().toLowerCase()
      const response = await fetch(`http://localhost:8080/api/events/search/by-city/${cityName}`)
      const listevent = await response.json();
      navigate("/search", { state: { events: listevent } });
    }catch(error){

    }
  }
  return (
    <div className="bg-gray-50 text-gray-900 w-full max-w-[1280px]  mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Top destinations in Viet Nam
      </h1>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth"
        >
          {popularCities.map((dest, index) => (
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
            onClick={()=> handleSearchByCity(city.key)}
            className="bg-white rounded-full px-4 py-2 shadow-sm text-gray-900 flex items-center space-x-2"
          >
            <span>Things to do in {city.name}</span>
            <FaExternalLinkAlt />
          </a>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <div>
      {/* <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {user ? `Welcome, ${user.email}` : 'Welcome to Event Management'}
      </h1>
      {user && user.roles.includes('ROLE_ADMIN') && (
        <p className="text-blue-600 mb-4">
          You have admin privileges. <a href="/dashboard" className="underline">Go to Dashboard</a>
        </p>
      )}
     
    </div> */}
      <SliderEvent />
      <Navbar />
      <ListEventScroll  />
      <EventListings />
      <TopDestinations />
      <Footer />
    </div>
  );
};
export default HomePage;
