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
    <div className=" max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular</h2>
      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center bg-white shadow rounded-lg overflow-hidden p-4 hover:bg-gray-100 transition"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-40 h-24 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-red-600">{event.date}</p>
              <p className="text-sm text-gray-600">{event.price}</p>
              <p className="text-sm text-gray-600">{event.organizer}</p>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <FaUserFriends className="mr-1 text-blue-500" /> {event.followers}
              </p>
            </div>
            <div className="flex flex-col items-center ml-4">
              <button className="text-gray-500 hover:text-red-500 mb-2">
                <FaHeart size={20} />
              </button>
              <button className="text-gray-500 hover:text-blue-500">
                <FaShareAlt size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
