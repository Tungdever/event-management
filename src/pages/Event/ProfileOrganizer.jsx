import React, { useState, useEffect } from 'react';
import FavoriteButton from "../../components/FavoriteButton";
import { useParams } from 'react-router-dom';
const ProfileOrganizer = () => {
  const { organizerName } = useParams();
  const [organizerData, setOrganizerData] = useState(null);
  const [activeTab, setActiveTab] = useState('public');
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventsPerPage = 4;

  // Fetch data and calculate initial counts
  useEffect(() => {
    fetch(`http://localhost:8080/api/events/search/organizer-infor/${encodeURIComponent(organizerName)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load organizer information');
        }
        return response.json();
      })
      .then((data) => {
        setOrganizerData(data);
        // Calculate total counts for upcoming and past events
        const upcoming = data.events.filter((event) => event.eventStatus === 'public').length;
        const past = data.events.filter((event) => event.eventStatus === 'Complete').length;
        setUpcomingCount(upcoming);
        setPastCount(past);
        // Set initial events for the active tab
        const filteredEvents = data.events.filter(
          (event) => event.eventStatus === (activeTab === 'public' ? 'public' : 'Complete')
        );
        setAllEvents(filteredEvents);
        setDisplayedEvents(filteredEvents.slice(0, eventsPerPage));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load organizer information');
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    if (!organizerData) return;
    const filteredEvents = organizerData.events.filter(
      (event) => event.eventStatus === (activeTab === 'public' ? 'public' : 'Complete')
    );
    setAllEvents(filteredEvents);
    setDisplayedEvents(filteredEvents.slice(0, eventsPerPage));
    setPage(1); 
  }, [activeTab, organizerData]);

  const handleViewMore = () => {
    if (displayedEvents.length >= allEvents.length) return;

    setIsLoading(true);

    setTimeout(() => {
      const startIndex = page * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      const newEvents = allEvents.slice(startIndex, endIndex);
      setDisplayedEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    }, 400);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const renderHTML = (html) => {
    return { __html: html };
  };

  if (isLoading && displayedEvents.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 bg-gray-50">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      {/* Header Organizer */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 relative overflow-hidden w-[800px] h-[600px] mx-auto grid">
        {organizerData?.organizer?.organizerLogo && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg scale-110 opacity-80"
            style={{ backgroundImage: `url(${organizerData.organizer.organizerLogo})` }}
          ></div>
        )}
         <div className="relative flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg w-[500px] h-[450px] mx-auto my-auto">
          {organizerData?.organizer?.organizerLogo ? (
            <img
              src={organizerData.organizer.organizerLogo}
              alt="Logo Tổ Chức"
              className="w-[200px] h-[200px] rounded-full object-cover border-4 border-purple-100 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-purple-100 shadow-md">
              <span className="text-gray-500 text-lg font-medium">Không Có Logo</span>
            </div>
          )}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              {organizerData?.organizer?.organizerName || 'the Comedy Nomad'}
            </h1>
            <div className="text-gray-600 text-sm mb-2 text-center">
              {organizerData?.organizer?.organizerDesc || ''}
            </div>
            <div className="flex justify-center gap-2 text-gray-500 text-sm">
              <span>{organizerData?.events?.length || 0} Sự Kiện</span>
            </div>
            <div className="flex justify-center gap-2 mt-2">
               {organizerData?.organizer?.organizerWebsite && (
                <a href={organizerData.organizer.organizerWebsite} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800" aria-label="Truy cập website">
                  <i className="fa-solid fa-link"></i>
                </a>
              )}
              </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {['public', 'Complete'].map((tab) => (
            <button
              key={tab}
              className={`${
                activeTab === tab
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              } py-2 px-4 font-medium text-sm transition-colors`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
            >
              {tab === 'public' ? `Upcoming (${upcomingCount})` : `Past (${pastCount})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) => (
            <div
              key={event.eventId}
              className="max-w-[300px] min-h-[400px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 cursor-pointer transition-shadow"
            >
              <div className="w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden relative">
                {event.eventImages?.[0] ? (
                  <div
                    className="relative w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.eventImages[0]})` }}
                  >
                    <FavoriteButton eventId={event.eventId} />
                  </div>
                ) : (
                  <img
                    src="https://via.placeholder.com/300x150"
                    alt="Default Event"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {truncateText(event.eventName, 25) || "Event Name"}
                </h3>
                <p className="text-gray-600 text-sm mt-1 truncate">
                  {truncateText(event.eventDesc, 30) || "No description"}
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(event.eventStart).toLocaleDateString("en-US")}
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Time:</span>{" "}
                  {new Date(event.eventStart).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  -{" "}
                  {new Date(event.eventEnd).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-gray-700 text-sm mt-1 truncate">
                  <span className="font-medium">Location:</span>{" "}
                  {truncateText(event.eventLocation?.city || "N/A", 25)}
                </p>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {event.tags && typeof event.tags === "string" ? (
                  event.tags.split("|").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {truncateText(tag.trim(), 10)}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-600 text-xs">No tags</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            No {activeTab === 'public' ? 'upcoming' : 'past'} events available.
          </div>
        )}
      </div>

      {/* View More Button */}
      {displayedEvents.length < allEvents.length && (
        <div className="flex justify-center mt-6">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
          ) : (
            <button
              onClick={handleViewMore}
              className="px-12 py-4 text-[#6F8579] rounded-[4px] hover:bg-gray-100 transition-colors border border-[#C2C4D0]"
            >
              View More
              <i className="fa-solid fa-circle-chevron-down ml-2"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileOrganizer;