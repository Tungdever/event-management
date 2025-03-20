import { useState } from "react";
import Header from "../../components/Header";

import SliderSpeaker from "../../components/SilderSpeaker";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import ListEventScroll from "../../components/EventListScroll";
import { FaRocket, FaInfoCircle } from "react-icons/fa";
import Checkout from "../Ticket/CheckOut";
const sections = [
  {
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    speakerName: "Dr. John Doe",
    speakerTitle: "Professor of Computer Science",
    topic: "The Future of AI",
  },
  {
    startTime: "10:15 AM",
    endTime: "11:00 AM",
    speakerName: "Ms. Jane Smith",
    speakerTitle: "CEO of Tech Innovations",
    topic: "Entrepreneurship in the Digital Age",
  },
  {
    startTime: "11:15 AM",
    endTime: "12:00 PM",
    speakerName: "Mr. Alan Walker",
    speakerTitle: "Cybersecurity Expert",
    topic: "Protecting Data in a Connected World",
  },
  {
    startTime: "01:30 PM",
    endTime: "02:30 PM",
    speakerName: "Dr. Emily Brown",
    speakerTitle: "AI Research Scientist",
    topic: "Ethical AI: Balancing Innovation and Responsibility",
  },
];

const eventdescription = {
  event_desc: `🌟About rev™ Saigon🌟

On March 28th, rev™ is debuting at Hilton Saigon. rev is our reverse-pitching series where we invite leading and emerging investors to showcase their propositions to you. (Pre-seed to Series-B founders.)



🌟Why rev?🌟

Pitching to VCs takes a chunk of time and loads of energy, and every rejection takes a little chip out of the soul. As an entrepreneur, you'd better be pitching to the right investors!

As a startup founder, you have hundreds of other things to do, so we’ve structured rev to deliver fast, efficient insights to make the best use of your time.



🌟What happens at rev?🌟

rev is about more than finding alignment with a VC's investment thesis; it's about finding where your chemistry and personalities resonate. We're here to help you discover the right investors efficiently.

Each VC has five minutes to pitch, followed by 2-3 of your questions.
Afterwards, immerse yourself in networking to leave a lasting impression - better still, make yourself unforgettable to the investors!
NB. If you are an investor and would like a speaking spot at rev, please register here and we’ll coordinate with you.`,
};
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
const speakers = [
  {
    id: 1,
    name: "Tony Wayne",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 2,
    name: "Emma Stone",
    role: "Designer",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Photographer",
    image:
      "https://images.unsplash.com/photo-1522091066250-665186289043?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 4,
    name: "Alice Brown",
    role: "Marketer",
    image:
      "https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 5,
    name: "Alice Brown",
    role: "Marketer",
    image:
      "https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
];
const EventDescription = ({ description }) => {
  return (
    <div className="text-gray-700 text-justify">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
};

const Timeline = ({ sections }) => {
  return (
    <div className="my-6 flex-col justify-center items-center mx-16">
      {sections.map((section, index) => (
        <div key={index} className="relative pl-8 sm:pl-32 py-6 group">
          {/* Thời gian (bên trái) */}
          <time className="absolute -left-5 translate-y-0.5 inline-flex items-center text-xs font-semibold uppercase min-w-max h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full whitespace-nowrap">
            {section.startTime} - {section.endTime}
          </time>

          {/* Đường kẻ timeline & chấm tròn */}
          <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
            <div className="text-xl font-bold text-slate-900">
              {section.speakerName}
            </div>
          </div>

          {/* Nội dung phát biểu */}
          <p className="text-gray-600">{section.speakerTitle}</p>
          <p className="text-lg font-bold text-indigo-700 mt-1">
            "{section.topic}"
          </p>
        </div>
      ))}
    </div>
  );
};

const Tags = () => {
  const tags = [
    "Online Events",
    "Things To Do Online",
    "Online Networking",
    "Online Health Networking",
    "#support",
    "#supportgroup",
    "#anxietyrelief",
    "#support_group",
    "#anxiety_relief",
    "#anxiety_support",
    "#anxiety_support_group",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
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
const EventDetail = ({ event }) => {
  const [participantCount, setParticipantCount] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const toggleTickets = () => setExpanded(!expanded);
  const [showPopup, setShowPopup] = useState(false);

  const imageUrl =
    "https://cdn.evbstatic.com/s3-build/fe/build/images/389ece7b7e2dc7ff8d28524bad30d52c-dsrp_desktop.webp";
  return (
    <>
      <Header />

      <div className="relative w-[1200px] h-[500px] mx-auto mt-6 rounded-lg overflow-hidden shadow-lg">
        {/* Background Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>

        {/* */}
        <img
          src={imageUrl}
          alt="Banner"
          className="absolute inset-0 m-auto w-auto h-auto max-w-full max-h-full object-contain"
        />
      </div>
      <div className="px-8 pt-8">
        {/* Event Details */}
        <div className="rounded-lg px-8 pt-4 leading-normal">
          <div className="flex items-start gap-4">
            <div className="flex-1 ml-20">
              <div className="text-gray-500 mb-2">
                {new Date(event.event_start).toDateString()}
              </div>

              <h1 className="text-5xl font-bold text-blue-900 mb-4">
                {event.event_name}
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
                    <p className="text-gray-900 font-semibold">By ShareWell</p>
                    <p className="text-gray-500">123.1k followers</p>
                    <p className="text-pink-500 font-semibold">
                      1.5M attendees hosted
                    </p>
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
                  {event.event_start} - {event.event_end}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Location
                </h2>
                <div className="text-gray-700">
                  <i className="bi bi-geo-alt pr-[10px]"></i>{" "}
                  {event.event_location}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Description
                </h2>
                <EventDescription
                  description={eventdescription.event_desc}
                  className="te"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Speaker</h2>
              <SliderSpeaker speakers={speakers} />
              <Tags />
              <OrganizedBy />
              {/* Section */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Section</h2>
              <Timeline sections={sections} />
            </div>
            {/* Ticket order */}
            <div className="max-w-[350px] min-w-[330px] h-60 bg-white border border-gray-200 rounded-lg p-6 shadow mt-4 mr-16 ml-10 sticky top-4">
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
                  {/* <p className="text-gray-600 text-[14px]">Free</p>
                  <FaInfoCircle className="text-blue-700 text-[16px]" /> */}
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

      <ListEventScroll events={eventData} />

      <Footer />
    </>
  );
};

export default EventDetail;
