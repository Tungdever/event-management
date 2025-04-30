import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import SliderSpeaker from "../../components/SilderSpeaker";
import Footer from "../../components/Footer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Checkout from "../Ticket/CheckOut";
import Loader from "../../components/Loading";
import { useParams } from "react-router-dom";
import ListEventScroll from "../../components/EventListScroll";
import { useAuth } from "../Auth/AuthProvider";
import axios from "axios";
// Helper: Định dạng thời gian
const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Helper: Fetch dữ liệu từ API
const fetchData = async (url, setData, errorMsg) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(errorMsg);
    const data = await response.json();
    setData(data);
    return data;
  } catch (error) {
    console.error(errorMsg, error);
    throw error;
  }
};

// Helper: Tính số lượng mới
const calculateNewCount = (current, delta, max, ticketType) => {
  const updated = current + delta;
  if (updated < 0) return 0;
  // For free tickets, max quantity is 1
  if (ticketType === "Free" && updated > 1) return 1;
  if (updated > max) return max;
  return updated;
};

// Helper: Cập nhật selectedTickets
const updateTickets = (prev, ticketId, newCount) => {
  if (newCount === 0) {
    const { [ticketId]: _, ...rest } = prev;
    return rest;
  }
  return { ...prev, [ticketId]: newCount };
};

const Timeline = ({ segments }) => {
  if (!segments?.length) {
    return (
      <div className="my-6 mx-16 text-gray-600">No segments available</div>
    );
  }

  return (
    <div className="my-6 flex-col justify-center items-center mx-16 ml-[100px]">
      {segments.map((segment, index) => (
        <div key={index} className="relative pl-8 sm:pl-32 py-6 group">
          <time className="absolute -left-5 translate-y-0.5 inline-flex items-center text-xs font-semibold uppercase min-w-max h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full whitespace-nowrap px-4 py-2">
            {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
          </time>
          <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
            <div className="text-xl font-bold text-slate-900">
              {segment.speaker?.speakerName || "Unknown Speaker"}
            </div>
          </div>
          <p className="text-gray-600">
            {segment.speaker?.speakerTitle || "No title"}
          </p>
          <p className="text-lg font-bold text-indigo-700 mt-1">
            "{segment.segmentTitle || "Untitled Segment"}"
          </p>
        </div>
      ))}
    </div>
  );
};

const OrganizedBy = () => {
const {user} = useAuth();
const [userData, setUserData] = useState([]);
const token = localStorage.getItem('token')
useEffect(() => { 
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/user/${user.email}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
      setUserData(response.data);

    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", err);

    }
  };
  fetchUserData();
}, []);
  return(
    <div className="mt-8 mb-4">
    <h2 className="text-2xl font-bold mb-4">Organize</h2>
    <div className="bg-gray-50 p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <img
          src="https://storage.googleapis.com/a1aa/image/iulMqkOeKR6SAOm-Zs8J1VIWV9rNEcpFiteM_nMV1hs.jpg"
          alt="Logo of ShareWell"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{userData.organizer?.organizerName || "N/A"}</h3>
          <div className="text-gray-600">
            <span className="mr-4">
              <strong>Location</strong> {userData.organizer?.organizerAddress || "N/A"}
            </span>
            <span>
              <strong>Phone</strong> {userData.organizer?.organizerPhone || "N/A"}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4">
      {userData.organizer?.organizerDesc || "N/A"}
      </p>
     
    </div>
  </div>
   )
};

const EventInfo = ({ eventData }) => (
  <div className="flex-1">
    <div className="text-gray-500 mb-2">
      {new Date(eventData.eventStart).toDateString()}
    </div>
    <h1 className="text-5xl font-bold text-blue-900 mb-4">
      {eventData.eventName || "Unnamed Event"}
    </h1>
    <OrganizedBy />
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Date and Time</h2>
      <div className="text-gray-700">
        <i className="bi bi-calendar-event pr-[10px]"></i>
        {eventData.eventStart} - {eventData.eventEnd}
      </div>
    </div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Location</h2>
      <div className="text-gray-700">
        <i className="bi bi-geo-alt pr-[10px]"></i>
        {eventData.eventLocation.venueName +
          " " +
          eventData.eventLocation.address +
          " " +
          eventData.eventLocation.city || "No location specified"}
      </div>
    </div>
  </div>
);

const OverviewContent = ({ eventData }) => (
  <div className="mb-6 flex-1">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2>
    <div className="text-gray-700 text-justify mb-4">
      {eventData.eventDesc || "No description available"}
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Overview</h2>
    <div className="text-gray-700 text-justify">
      <p className="mb-4">
        {eventData.textContent || "No description available"}
      </p>
      {eventData.mediaContent?.length > 0 ? (
        eventData.mediaContent.map((mediaContent, index) => (
          <img
            key={index}
            src={mediaContent}
            alt={eventData.eventName}
            className="w-full h-full object-cover"
          />
        ))
      ) : (
        <img
          src="https://via.placeholder.com/300x150"
          alt="Default Event"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  </div>
);

const TicketSelector = ({ tickets, selectedTickets, onQuantityChange, onSelect }) => (
  <div className="w-[500px] bg-white border border-gray-200 rounded-lg p-6 shadow mt-4 mr-16 ml-10">
    <div className="mb-4 p-4 border-[3px] border-blue-800 rounded-lg w-[380px]">
      {!tickets ? (
        <p className="text-gray-700 text-[14px]">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-700 text-[14px]">No tickets available</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-900 font-semibold text-[16px]">
                    {ticket.ticketName}
                  </p>
                  <p className="text-gray-700 text-[14px]">
                    {ticket.price} USD
                    {ticket.ticketType === "Free" && (
                      <span className="text-gray-500 text-[12px] ml-2">(Max 1 ticket)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300 transition"
                    onClick={() =>
                      onQuantityChange(
                        ticket.ticketId,
                        ticket.quantity,
                        -1,
                        ticket.ticketType
                      )
                    }
                    disabled={(selectedTickets[ticket.ticketId] || 0) === 0}
                  >
                    -
                  </button>
                  <span className="text-gray-900 font-semibold text-[14px] w-8 text-center">
                    {selectedTickets[ticket.ticketId] || 0}
                  </span>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() =>
                      onQuantityChange(
                        ticket.ticketId,
                        ticket.quantity,
                        1,
                        ticket.ticketType
                      )
                    }
                    disabled={
                      (selectedTickets[ticket.ticketId] || 0) >= ticket.quantity ||
                      (ticket.ticketType === "Free" &&
                        (selectedTickets[ticket.ticketId] || 0) >= 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-gray-700 text-[12px]">
                <p>Amount: {ticket.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <button
      className="bg-red-600 text-white w-full py-2 rounded-lg hover:bg-red-500 mt-2 disabled:bg-gray-400"
      onClick={onSelect}
      disabled={Object.keys(selectedTickets).length === 0}
    >
      Select tickets
    </button>
  </div>
);


const EventDetail = () => {
  const token = localStorage.getItem("token");
  const { eventId } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [segmentData, setSegments] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [tickets, setTickets] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [event, segments, tickets] = await Promise.all([
          fetchData(
            `http://localhost:8080/api/events/${eventId}`,
            setEventData,
            "Failed to fetch event"
          ),
          fetchData(
            `http://localhost:8080/api/segment/${eventId}/getSegment`,
            setSegments,
            "Failed to fetch segment"
          ),
          fetchData(
            `http://localhost:8080/api/ticket/list/${eventId}`,
            setTickets,
            "Failed to fetch tickets"
          ),
        ]);

        if (segments) {
          const speakerList = segments
            .map((segment) => segment.speaker)
            .filter(Boolean);
          setSpeakers(speakerList);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [eventId]);

  const handleQuantityChange = (ticketId, maxQuantity, delta, ticketType) => {
    setSelectedTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const newCount = calculateNewCount(currentCount, delta, maxQuantity, ticketType);
      return updateTickets(prev, ticketId, newCount);
    });
  };

  const getSelectedTicketsData = () => {
    return (
      tickets
        ?.filter((ticket) => selectedTickets[ticket.ticketId] > 0)
        .map((ticket) => ({
          ...ticket,
          quantity: selectedTickets[ticket.ticketId],
        })) || []
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 p-8">
        Error: {error}. Please try again later.
      </div>
    );

  return (
    <>
      <div className="relative w-[1200px] h-[500px] mx-auto mt-6 rounded-lg overflow-hidden shadow-lg">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          className="w-full h-full"
        >
          {eventData?.eventImages?.length > 0 ? (
            eventData.eventImages.map((imageUrl, index) => (
              <div key={index} className="relative w-full h-[500px]">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                <img
                  src={imageUrl}
                  alt={`Event Image ${index + 1}`}
                  className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
                />
              </div>
            ))
          ) : (
            <div className="relative w-full h-[500px]">
              <div
                className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                style={{
                  backgroundImage: `url(https://via.placeholder.com/1200x500)`,
                }}
              ></div>
              <img
                src="https://via.placeholder.com/1200x500"
                alt="Default Banner"
                className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </Carousel>
      </div>
      <div className="px-8 pt-8">
        <div className="rounded-lg px-6 pt-4 leading-normal">
          <div className="flex items-start gap-2">
            <div className="ml-10">
              <EventInfo eventData={eventData} />
              <OverviewContent eventData={eventData} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Speaker</h2>
              <SliderSpeaker speakers={speakers} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Section</h2>
              <Timeline segments={segmentData} />
              <div>
                <h2 className="text-2xl font-bold mb-4 mt-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {eventData?.tags?.split("|").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  )) || (
                    <span className="text-gray-600">No tags available</span>
                  )}
                </div>
              </div>
              
            </div>
              
            <TicketSelector
              tickets={tickets}
              selectedTickets={selectedTickets}
              onQuantityChange={handleQuantityChange}
              onSelect={() => setShowPopup(true)}
            />
          </div>
        </div>
      </div>
      {showPopup && (
        <Checkout
          onClose={() => setShowPopup(false)}
          selectedTickets={getSelectedTicketsData()}
        />
      )}
      <ListEventScroll/>
      <Footer />
    </>
  );
};

export default EventDetail;