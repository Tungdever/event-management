import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import SliderSpeaker from "../../components/SilderSpeaker";
import Footer from "../../components/Footer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Checkout from "../Ticket/CheckOut";
import Loader from "../../components/Loading";
import { useParams } from "react-router-dom";
import ListEventScroll from "../../components/EventListScroll";
import DOMPurify from "dompurify";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
//  : Format date and time
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = parseISO(isoString);
    return format(date, "MMM d, yyyy 'at' HH:mm");
  } catch {
    return "Invalid date";
  }
};

//  : Format time only
const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = parseISO(isoString);
    return format(date, "HH:mm");
  } catch {
    return "Invalid time";
  }
};

//  : Calculate new ticket count
const calculateNewCount = (current, delta, max, ticketType) => {
  const updated = current + delta;
  if (updated < 0) return 0;
  if (ticketType === "Free" && updated > 1) return 1;
  if (updated > max) return max;
  return updated;
};

//  : Update selected tickets
const updateTickets = (prev, ticketId, newCount) => {
  if (newCount === 0) {
    const { [ticketId]: _, ...rest } = prev;
    return rest;
  }
  return { ...prev, [ticketId]: newCount };
};

// Custom hook for fetching event data
const useEventData = (eventId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/api/events/detail/${eventId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch event data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to fetch event data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  return { data, loading, error };
};

// Timeline Component
const Timeline = ({ segments }) => {
  if (!segments?.length) {
    return (
      <div className="my-4 sm:my-6 mx-4 sm:mx-8 lg:mx-16 text-gray-600 text-sm sm:text-base">
        No segments available
      </div>
    );
  }

  return (
    <div className="my-4 sm:my-6 mx-4 sm:mx-8 lg:mx-16 sm:ml-12 lg:ml-[100px]">
      {segments.map((segment, index) => (
        <div
          key={segment.segmentId}
          className="relative pl-4 sm:pl-16 lg:pl-32 py-4 sm:py-6 group"
        >
          <time className="relative sm:absolute left-0 sm:-left-12 lg:-left-16 translate-y-0.5 inline-flex items-center text-[10px] sm:text-xs lg:text-sm font-semibold uppercase min-w-max h-5 sm:h-6 lg:h-7 mb-2 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full whitespace-nowrap px-2 sm:px-3 lg:px-4 py-1 sm:py-1 lg:py-2">
            {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
          </time>
          <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-0 sm:before:left-6 lg:before:left-10 before:h-full before:px-px before:bg-slate-300 sm:before:ml-6 lg:before:ml-8 before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-0 sm:after:left-6 lg:after:left-10 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-6 lg:after:ml-8 after:-translate-x-1/2 after:translate-y-1.5">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
              {segment.speaker?.speakerName || ""}
            </div>
          </div>
          <p className="text-gray-600 text-[11px] sm:text-sm lg:text-base">
            {segment.speaker?.speakerDesc || ""}
          </p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-indigo-700 mt-1">
            "{segment.segmentTitle || "Untitled Segment"}"
          </p>
           <p className="text-gray-600 text-[11px] sm:text-sm lg:text-base">
            "{segment.segmentDesc || "Untitled Segment"}"
          </p>
        </div>
      ))}
    </div>
  );
};

// OrganizedBy Component
const OrganizedBy = ({ organizer }) => {
  const navigate = useNavigate();

  const handleOrganizerClick = () => {
    if (organizer?.organizerName) {
      window.open(
        `/profile-organizer/${encodeURIComponent(organizer.organizerName)}`,
        "_blank"
      );
    }
  };
  return (
    <div className="mt-10 mb-8 max-w-3xl font-inter">
      <h2 className="text-lg sm:text-xl font-playfair font-semibold text-gray-800 mb-3">
        Organized by
      </h2>
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full animate-pulse-subtle" />

            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-gray-100 shadow-sm">
              <img
                src={organizer?.organizerLogo}
                alt="Logo Tổ Chức"
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 shadow-md"
              />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3
              className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold text-gray-900 mb-3 leading-tight hover:text-red-500 hover:underline cursor-pointer transition-colors duration-300"
              onClick={handleOrganizerClick}
            >
              {organizer?.organizerName || "N/A"}
            </h3>

            <p className="text-gray-700 text-sm sm:text-base font-inter leading-relaxed max-w-lg mx-auto sm:mx-0 italic">
              {organizer?.organizerDesc || "No description available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// EventInfo Component
const EventInfo = ({ eventData, organizerData }) => (
  <div className="flex-1">
    <div className="text-gray-500 text-sm sm:text-base mb-2">
      {formatDateTime(eventData?.eventStart)}
    </div>
    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-blue-900 mb-3 sm:mb-4">
      {eventData?.eventName || "Unnamed Event"}
    </h1>
    <OrganizedBy organizer={organizerData} />
    <div className="mt-6 mb-6  pt-6">
     
      <h2 className="text-lg sm:text-xl font-playfair font-semibold text-gray-800 mb-3">
        Date and Time
      </h2>
      <div className="text-gray-700 text-sm sm:text-base flex items-center">
        <i className="fa-regular fa-calendar-days mr-4"></i>
        <span className="text-[14px] font-bold">
          {formatDateTime(eventData?.eventStart)} -{" "}
          {formatDateTime(eventData?.eventEnd)}
        </span>
      </div>
    </div>
    <div className="mb-6">
      <h2 className="text-lg sm:text-xl font-playfair font-semibold text-gray-800 mb-3">
        Location
      </h2>
      <div className="text-gray-700 text-sm sm:text-base flex items-center">
        <i className="fa-solid fa-location-dot mr-4"></i>
        <span className="text-[14px] font-bold">
          {eventData?.eventLocation?.venueName
            ? `${eventData.eventLocation.venueName}, ${eventData.eventLocation.address}, ${eventData.eventLocation.city}`
            : "No location specified"}
        </span>
      </div>
    </div>
  </div>
);

// OverviewContent Component
const OverviewContent = ({ eventData }) => (
  <div className="mb-4 sm:mb-6 flex-1">
    <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800 mb-2">
      Description
    </h2>
    <div
      className="text-gray-700 text-sm sm:text-base text-justify mb-3 sm:mb-4 prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: eventData?.eventDesc
          ? DOMPurify.sanitize(eventData.eventDesc)
          : "No description available",
      }}
    />
    <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800 mb-2">
      Overview
    </h2>
    <div className="text-gray-700 text-sm sm:text-base text-justify">
      <p
        className="mb-3 sm:mb-4"
        dangerouslySetInnerHTML={{
          __html: eventData?.textContent
            ? DOMPurify.sanitize(eventData.textContent)
            : "No description available",
        }}
      />
      {eventData?.mediaContent?.length > 0 ? (
        eventData.mediaContent.map((mediaContent, index) => (
          <img
            key={index}
            src={mediaContent}
            alt={`${eventData.eventName} media ${index + 1}`}
            className="w-full h-auto object-cover rounded-lg mb-3 sm:mb-4"
          />
        ))
      ) : (
        <></>
      )}
    </div>
  </div>
);

// TicketSelector Component
const TicketSelector = ({tickets,selectedTickets,onQuantityChange,onSelect,}) => (
  <div className="w-full sm:w-[400px] lg:w-[450px] bg-white border border-gray-200 rounded-xl p-6 shadow-lg mt-6 sm:mr-10  top-6">
    <div className="mb-4 p-4 border-2 border-red-400 rounded-lg">
      {!tickets ? (
        <p className="text-gray-700 text-sm font-inter">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-700 text-sm font-inter">No tickets available</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="border border-gray-400 rounded-lg p-4 bg-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-900 font-semibold text-base font-inter">
                    {ticket.ticketName}
                  </p>
                  <p className="text-gray-700 text-sm font-inter">
                    {ticket.price.toLocaleString()} VND
                    {ticket.ticketType === "Free" && (
                      <span className="text-gray-500 text-xs ml-2">
                        (Max 1 ticket)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded-[4px] hover:bg-gray-300 transition text-sm font-inter"
                    onClick={() =>
                      onQuantityChange(
                        ticket.ticketId,
                        ticket.quantity,
                        -1,
                        ticket.ticketType
                      )
                    }
                    disabled={(selectedTickets[ticket.ticketId] || 0) === 0}
                    aria-label={`Decrease quantity for ${ticket.ticketName}`}
                  >
                    -
                  </button>
                  <span className="text-gray-900 font-semibold text-sm w-8 text-center font-inter">
                    {selectedTickets[ticket.ticketId] || 0}
                  </span>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-[4px] hover:bg-red-600 transition text-sm font-inter"
                    onClick={() =>
                      onQuantityChange(
                        ticket.ticketId,
                        ticket.quantity,
                        1,
                        ticket.ticketType
                      )
                    }
                    disabled={
                      (selectedTickets[ticket.ticketId] || 0) >=
                        ticket.quantity ||
                      (ticket.ticketType === "Free" &&
                        (selectedTickets[ticket.ticketId] || 0) >= 1)
                    }
                    aria-label={`Increase quantity for ${ticket.ticketName}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-gray-600 text-xs font-inter">
                <p>Available: {ticket.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <button
      className="bg-red-500 text-white w-full py-3 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 text-base font-semibold font-inter shadow-md"
      onClick={onSelect}
      disabled={Object.keys(selectedTickets).length === 0}
      aria-label="Select tickets"
    >
      Select Tickets
    </button>
  </div>
);

// Sponsors Component
const Sponsors = ({ sponsors }) => {
  if (!sponsors?.length) {
    return null;
  }

  return (
    <div className="my-4 sm:my-6">
      <h2 className="text-lg sm:text-xl lg:text-xl font-bold mb-3 sm:mb-4">
        Sponsors
      </h2>
      <div className="flex flex-wrap gap-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.sponsorId} className="flex items-center">
            <img
              src={sponsor.sponsorLogo}
              alt={`${sponsor.sponsorName} logo`}
              className="w-16 h-16 object-contain"
            />
            <span className="ml-2 text-sm sm:text-base">
              {sponsor.sponsorName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main EventDetail Component
const EventDetail = () => {
  const { eventId } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [segmentData, setSegments] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [tickets, setTickets] = useState(null);
  const [sponsors, setSponsors] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState({});

  const { data, loading, error } = useEventData(eventId);

  useEffect(() => {
    if (data) {
      setEventData(data.event);
      setSegments(data.segments);
      setTickets(data.tickets);
      setSponsors(data.sponsors);
      setOrganizer(data.organizer);
      setSpeakers(
        data.segments?.map((segment) => segment.speaker).filter(Boolean) || []
      );
    }
    window.scrollTo(0, 0);
  }, [data]);

  const handleQuantityChange = (ticketId, maxQuantity, delta, ticketType) => {
    setSelectedTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const newCount = calculateNewCount(
        currentCount,
        delta,
        maxQuantity,
        ticketType
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 sm:p-8 text-sm sm:text-base">
        Error: {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>{`
        .carousel,
        .slider-wrapper,
        .slider {
          height: 100% !important;
        }
      `}</style>
      <div className="relative w-full max-w-[1200px] mx-auto mt-4 sm:mt-6 h-[200px] sm:h-[350px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          dynamicHeight={false}
          className="w-full h-full"
        >
          {eventData?.eventImages?.length > 0 ? (
            eventData.eventImages.map((imageUrl, index) => (
              <div key={index} className="relative w-full h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                <img
                  src={imageUrl}
                  alt={`Event image ${index + 1}`}
                  className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
                />
              </div>
            ))
          ) : (
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                style={{
                  backgroundImage: `url(https://via.placeholder.com/1200x500)`,
                }}
              ></div>
              <img
                src="https://via.placeholder.com/1200x500"
                alt="Default event banner"
                className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </Carousel>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="rounded-lg px-4 sm:px-6 pt-4 leading-normal">
          <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-2">
            <div className="w-full lg:flex-1 ml-4 sm:ml-6 lg:ml-10">
              <EventInfo eventData={eventData} organizerData={organizer} />
              <OverviewContent eventData={eventData} />
              <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800 mb-2">
                Speakers
              </h2>
              <SliderSpeaker speakers={speakers} />
              <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800 mb-2">
                Schedule
              </h2>
              <Timeline segments={segmentData} />
              <Sponsors sponsors={sponsors} />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 mt-3 sm:mt-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {eventData?.tags?.split("|").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                    >
                      {tag.trim()}
                    </span>
                  )) || (
                    <span className="text-gray-600 text-xs sm:text-sm">
                      No tags available
                    </span>
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
          eventData={eventData}
        />
      )}
      <ListEventScroll />
      <Footer />
    </div>
  );
};

export default EventDetail;
