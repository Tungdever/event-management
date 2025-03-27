import { useState ,useEffect} from "react";
import Header from "../../components/Header";
import { Carousel } from "react-responsive-carousel";
import SliderSpeaker from "../../components/SilderSpeaker";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import ListEventScroll from "../../components/EventListScroll";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Checkout from "../Ticket/CheckOut";
import { Loader } from "lucide-react";


const Timeline = ({ segments }) => {
    // Hàm tách giờ và phút từ chuỗi thời gian
    const formatTime = (isoString) => {
      if (!isoString) return "N/A"; // Xử lý trường hợp thời gian không có
      const date = new Date(isoString);
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
  
    // Kiểm tra segments có tồn tại và là mảng không
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return <div className="my-6 mx-16 text-gray-600">No segments available</div>;
    }
  
    return (
      <div className="my-6 flex-col justify-center items-center mx-16">
        {segments.map((segment, index) => (
          <div key={index} className="relative pl-8 sm:pl-32 py-6 group">
            {/* Thời gian (bên trái) */}
            <time className="absolute -left-5 translate-y-0.5 inline-flex items-center text-xs font-semibold uppercase min-w-max h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full whitespace-nowrap">
              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
            </time>
  
            {/* Đường kẻ timeline & chấm tròn */}
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
              <div className="text-xl font-bold text-slate-900">
                {segment.speaker?.speakerName || "Unknown Speaker"}
              </div>
            </div>
  
            {/* Nội dung phát biểu */}
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
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Organized by</h2>
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <img
            src="https://storage.googleapis.com/a1aa/image/iulMqkOeKR6SAOm-Zs8J1VIWV9rNEcpFiteM_nMV1hs.jpg"
            alt="Logo of ShareWell"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold">ShareWell</h3>
            <div className="text-gray-600">
              <span className="mr-4">
                <strong>4.8k</strong> followers
              </span>
              <span>
                <strong>13.4k</strong> attendees hosted
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          Welcome! ShareWell is a warm and welcoming peer-to-peer community for
          mental wellness. We host support groups for people looking to connect
          with others to overcome similar life challenges. Ground Rules for
          ShareWell Peer Support Sessions:...
        </p>
        <a href="#" className="text-blue-600">
          View more
        </a>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full mr-2">
            Contact
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};
const EventDetail = ({ eventId }) => {
  const [participantCount, setParticipantCount] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [segmentData, setSegments] = useState(null);
  const [speakers, setSpeakers] = useState([]);

  // Hàm lấy dữ liệu sự kiện từ API
  const fetchEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };
  const fetchSegment = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/segment/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch segment");
      }
      const data = await response.json();
      setSegments(data);
      const speakerList = data.map((segment) => segment.speaker);
      setSpeakers(speakerList);
    } catch (error) {
      console.error("Error fetching segment:", error);
    }
  };


  useEffect(() => {
    fetchEvent(eventId); 
    fetchSegment(eventId);
  }, [eventId]);

  if (!eventData) {
    return <Loader/>;
  }
  
  return (
    <>
      <Header />

     {/* Slider hiển thị nhiều ảnh từ eventImages */}
     <div className="relative w-[1200px] h-[500px] mx-auto mt-6 rounded-lg overflow-hidden shadow-lg">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          className="w-full h-full"
        >
          {eventData.eventImages && eventData.eventImages.length > 0 ? (
            eventData.eventImages.map((imageUrl, index) => (
              <div key={index} className="relative w-full h-[500px]">
                {/* Background Blur */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                {/* Ảnh chính */}
                <img
                  src={imageUrl}
                  alt={`Event Image ${index + 1}`}
                  className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
                />
              </div>
            ))
          ) : (
            <div className="relative w-full h-[500px]">
              {/* Ảnh mặc định nếu không có ảnh */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                style={{ backgroundImage: `url(https://via.placeholder.com/1200x500)` }}
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
        {/* Event Details */}
        <div className="rounded-lg px-8 pt-4 leading-normal">
          <div className="flex items-start gap-4">
            <div className="flex-1 ml-20">
              <div className="text-gray-500 mb-2">
                {new Date(eventData.eventStart).toDateString()}
              </div>

              <h1 className="text-5xl font-bold text-blue-900 mb-4">
                {eventData.eventName}
              </h1>
              {/* Host */}
              <section className="mt-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://storage.googleapis.com/a1aa/image/iulMqkOeKR6SAOm-Zs8J1VIWV9rNEcpFiteM_nMV1hs.jpg"
                    alt="Logo of ShareWell"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-gray-900 font-semibold">By {eventData.eventHost}</p>
                    
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Follow
                </button>
              </section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Date and Time
                </h2>
                <div className="text-gray-700 ">
                  <i className="bi bi-calendar-event pr-[10px]"></i>{" "}
                  {eventData.eventStart} - {eventData.eventEnd}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Location
                </h2>
                <div className="text-gray-700">
                  <i className="bi bi-geo-alt pr-[10px]"></i>{" "}
                  {eventData.eventLocation}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Description
                </h2>
 
                <div className="text-gray-700 text-justify">
                  <ReactMarkdown>{eventData.eventDesc}</ReactMarkdown>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Speaker</h2>
              <SliderSpeaker speakers={speakers} />
              {/* Section */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Section</h2>
              <Timeline segments={segmentData} />
              <div>
                <h2 className="text-2xl font-bold mb-4 mt-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                    {eventData.tags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
                    >
                        {tag}
                    </span>
                    ))}
                </div>
                </div>
              <OrganizedBy />
              
              
            </div>
            {/* Ticket order */}
            <div className="max-w-[400px] min-w-[350px] h-100 bg-white border border-gray-200 rounded-lg p-6 shadow mt-4 mr-16 ml-10 sticky top-4">
              <div className="flex-col justify-between items-center mb-4 p-4 border border-[3px] border-blue-800 rounded-lg">
                <div className="flex items-center my-4">
                  <p className="text-gray-900 font-semibold mr-4 text-[16px]">
                    Online Participant
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      className="bg-gray-200 text-gray-600 px-[12px] py-1 rounded"
                      onClick={() =>
                        setParticipantCount(Math.max(1, participantCount - 1))
                      }
                    >
                      -
                    </button>
                    <span className="text-gray-900 font-semibold text-[14px]">
                      {participantCount}
                    </span>
                    <button
                      className="bg-blue-600 text-white px-[12px] py-1 rounded"
                      onClick={() => setParticipantCount(participantCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex  items-center mb-4 space-x-4 ">
                  
                  <select className="w-full bg-gray-100 border-[1px] border-gray-200 rounded-[4px] p-2 border-none mb-4 text-[12px] focus:outline-none focus:border-transparent focus:ring-0">
                  <option value="1">VIP- 200.00 VND</option>
                  <option value="1">COMMON- 100.00 VND</option>
            </select>
                </div>
              </div>

              <div>
                <button
                  className="bg-red-600 text-white w-full py-2 rounded-lg hover:bg-red-500 mt-2"
                  onClick={() => setShowPopup(true)}
                >
                  Select tickets
                </button>

                {/* Hiển thị popup nếu showPopup === true */}
                {showPopup && <Checkout onClose={() => setShowPopup(false)} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ListEventScroll events={eventData} /> */}

      <Footer />
    </>
  );
};

export default EventDetail;
