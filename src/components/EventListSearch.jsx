import { useState } from "react";
import { FaUserFriends, FaHeart, FaShareAlt } from "react-icons/fa";

const events = [
  {
    id: 1,
    title: "How To Connect With Confidence",
    date: "Thu, Mar 13, 2025 1:00 AM +07",
    price: "Free",
    organizer: "ShareWell",
    followers: "4.9k followers",
    image:
      "https://i.pinimg.com/474x/41/de/a2/41dea2aba29eba7e3558c4f58821ef3c.jpg",
  },
  {
    id: 2,
    title: "Who Are You Really? Discovering Your True Self",
    date: "Thu, Mar 13, 2025 2:00 AM +07",
    price: "Free",
    organizer: "ShareWell",
    followers: "4.9k followers",
    image:
      "https://i.pinimg.com/474x/99/e6/97/99e697e6f2125eafd83cfb40ffa1f8db.jpg",
  },
  {
    id: 3,
    title: "Positive Psychology for Everyday Happiness",
    date: "Thu, Mar 13, 2025 6:00 AM +07",
    price: "Free",
    organizer: "ShareWell",
    followers: "4.9k followers",
    image:
      "https://i.pinimg.com/474x/4b/66/41/4b66412d4fec485d434847fa01c42bed.jpg",
  },
];

export default function EventList() {
  return (
<div className="max-w-4xl ">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          More events from this organizer
        </h2>
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start mb-6 bg-white p-4 rounded-lg shadow"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-red-600">{event.date}</p>
              <p className="text-sm text-gray-600">{event.price}</p>
              <p className="text-sm text-gray-600">{event.organizer}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaUserFriends className="mr-1" /> {event.followers}
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img
                alt={event.title}
                className="w-[200px] h-[110px] object-cover rounded"
                src={event.image}
              />
            </div>
            <div className="flex flex-col items-center justify-center ml-4">
              <button className="text-gray-500 hover:text-gray-700">
                <FaHeart />
              </button>
              <button className="text-gray-500 hover:text-gray-700 mt-2">
                <FaShareAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
  );
}
