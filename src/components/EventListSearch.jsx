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
  {
    id: 4,
    title: "Positive Psychology for Everyday Happiness",
    date: "Thu, Mar 13, 2025 6:00 AM +07",
    price: "Free",
    organizer: "ShareWell",
    followers: "4.9k followers",
    image:
      "https://i.pinimg.com/474x/9b/ab/8c/9bab8cbbd116aeef9f73df374ed5ae4a.jpg",
  },
  {
    id: 5,
    title: "Positive Psychology for Everyday Happiness",
    date: "Thu, Mar 13, 2025 6:00 AM +07",
    price: "Free",
    organizer: "ShareWell",
    followers: "4.9k followers",
    image:
      "https://i.pinimg.com/474x/76/c0/11/76c01143ad586a2c79b608937be9aab9.jpg",
  },
  {
    id: 6,
    title: "Positive Psychology for Everyday Happiness",
    date: "Thu, Mar 13, 2025 6:00 AM +07",
    price: "Free",
    organizer: "ShareWell",
    followers: "4.9k followers",
    image:
      "https://i.pinimg.com/474x/4c/12/c2/4c12c222e4d2e660180af39794618aa9.jpg",
  },
];

export default function EventList() {
  return (
    <div className="max-w-5xl mx-auto p-6 border-l-2">
      {/* <h2 className="text-3xl font-bold text-gray-900 mb-8">Events</h2> */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center w-[700px] bg-white shadow rounded-xl overflow-hidden p-4 hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-44 h-24 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-sm font-medium text-red-500">{event.price}</p>
              <p className="text-sm text-gray-600">{event.organizer}</p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <FaUserFriends className="mr-1 text-blue-500" /> {event.followers}
              </div>
            </div>
            <div className="flex flex-col items-center ml-6 space-y-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-500 transition-all">
                <FaHeart size={18} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-500 transition-all">
                <FaShareAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
