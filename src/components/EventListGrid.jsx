import React from "react";

const events = [
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

const EventCard = ({ event}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:bg-gray-200 cursor-pointer">
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
  );
};

const EventListings = () => {
  return (
    <div className=" w-full max-w-[1280px]  mx-auto p-4">
       <div className="flex items-center justify-between mb-4">
       <h2 className="text-2xl font-bold text-left mb-4">Events in Ho Chi Minh City</h2>
        <div className="flex space-x-1 justify-center items-center text-[13px] hover:cursor-pointer hover:text-blue-800">
         <span className="">View more </span>
         <i className="bi bi-chevron-right text-[12px]"></i>
         
        </div>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventListings;
