import React, { useState } from "react";
import EventForm from "./CreateEvent";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";

const eventData = {
    event_id: 1,
    event_desc: "Đêm nhạc Acoustic với các ca sĩ nổi tiếng",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_name: "Acoustic Night 2025",
    man_id: 101,
    mc_id: 202,
    event_type: "Concert",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Sheraton Hanoi Hotel 11 Đường Xuân Diệu Hanoi, Hà Nội ",
    event_status: "Sắp diễn ra",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  };

const CRUDEvent = () => {
  
  const [selectedStep, setSelectedStep] = useState("build");

  const renderStepComponent = () => {
    switch (selectedStep) {
      case "build":
        return <EventForm />;
      case "tickets":
        return <AddTicket />;
      case "publish":
        return <EventPublishing eventData={eventData}/>;
      default:
        return <EventForm />;
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row justify-center items-start lg:items-stretch p-6 space-y-4 lg:space-y-0 lg:space-x-2 min-h-screen">
      {/* Left Section */}
      <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm ">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">
            Mental Health First Aid (MHFA) Training (CPD Accredited)
          </h2>
          <div className="flex items-center text-gray-500 mt-2">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>Wed, Apr 16, 2025, 10:00 AM</span>
          </div>
          <div className="flex items-center mt-4">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">
              Draft <i className="fas fa-caret-down ml-1"></i>
            </button>
            <a href="#" className="text-blue-600">
              Preview <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Steps</h3>
        <div className="space-y-2">
          {["build", "tickets", "publish"].map((step) => (
            <label key={step} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="eventStep"
                value={step}
                checked={selectedStep === step}
                onChange={() => setSelectedStep(step)}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <span>
                {step === "build" && "Build event page"}
                {step === "tickets" && "Add tickets"}
                {step === "publish" && "Publish"}
              </span>
            </label>
          ))}
        </div>
      </aside>

      {/* Right Section */}
      <div className="px-2 w-full lg:w-3/4">{renderStepComponent()}</div>
    </div>
  );
};

export default CRUDEvent;
import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
const TagsInput = () => {
  const [tags, setTags] = useState([
    "mental_health",
    "first_aid",
    "training",
    "cpd_accredited",
    "wellness",
  ]);

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tags-container p-4 border rounded-md w-full max-w-xl mb-4">
      <div className="tags-list flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="tag flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full"
          >
            <span className="text-gray-600 text-[14px]">{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="text-gray-500 hover:text-gray-900"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </span>
        ))}
      </div>
      <div className="mt-3">
        <label htmlFor="eventTags" className="text-gray-600 text-sm">
          Add search keywords to your event
        </label>
        <input
          id="eventTags"
          type="text"
          name="event.tags"
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="Type and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              setTags([...tags, e.target.value]);
              e.target.value = "";
            }
          }}
        />
      </div>
      <div className="mt-2 text-gray-500 text-sm">{tags.length}/10 tags</div>
    </div>
  );
};
const PublishSettings = () => {
  const [eventVisibility, setEventVisibility] = useState("public");
  const [publishTime, setPublishTime] = useState("now");
  const [refunds ,setRefunds] = useState("yes")
  const [validityDays, setValidityDays] = useState(7);

  const handleChange = (event) => {
    setValidityDays(event.target.value);
  };
  return (
    <div className="w-full max-w-4xl mt-8 mb-4 relative">
      <h1 className="text-2xl font-bold mb-6">Publish settings</h1>
      <div className="flex flex-col md:flex-row mb-10">
        <div className="flex-1">
          {/* public or private */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Is your event public or private?
            </h2>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="event_visibility"
                  checked={eventVisibility === "public"}
                  onChange={() => setEventVisibility("public")}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500 mr-2"
                />
                <span className="text-base">Public</span>
              </label>
              <p className="text-sm text-gray-500 ml-6">
                Shared on Eventbrite and search engines
              </p>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="event_visibility"
                  checked={eventVisibility === "private"}
                  onChange={() => setEventVisibility("private")}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500 mr-2"
                />
                <span className="text-base">Private</span>
              </label>
              <p className="text-sm text-gray-500 ml-6">
                Shared only with a select audience
              </p>
            </div>
            {eventVisibility === "private" ? <select className="w-full p-2 border border-gray-300 rounded-lg mt-2">
              <option value="1">Anyon with the link</option>
             
            </select> : <></>}
          </div>
          {/* Refund policy */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Set your refund policy
            </h2>
            <p className="text-gray-500 text-[13px] mb-2">
              After your event is published, you can only update your policy to
              make it more flexible for your attendees.
            </p>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="refund_option"
                  checked={refunds === "yes"}
                  onChange={() => setRefunds("yes")}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500 mr-2"
                />
                <span className="text-base">Allow refunds</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="refund_option"
                  checked={refunds === "no"}
                  onChange={() => setRefunds("no")}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500 mr-2"
                />
                <span className="text-base">Don't allow refunds</span>
              </label>
            </div>
            {refunds ==="yes" ?<div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label
                  htmlFor="refundPolicyCutoffText"
                  className="text-gray-700 text-[11px] mt-3"
                >
                  Days before the event
                </label>
                <input
                  id="refundPolicyCutoffText"
                  type="number"
                  name="refundPolicy.validityDays"
                  value={validityDays}
                  onChange={handleChange}
                  min={1}
                  max={30}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-gray-700 text-[13px]">
                Set how many days (1 to 30) before the event that attendees can
                request refunds.
              </p>
            </div> :<></> }
            
          </div>
        </div>
        <div className="flex-1 mt-6 md:mt-0 md:ml-6">
          {/* Schedule publish */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              When should we publish your event?
            </h2>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="publish_time"
                  checked={publishTime === "now"}
                  onChange={() => setPublishTime("now")}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500 mr-2"
                />
                <span className="text-base">Publish now</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="publish_time"
                  checked={publishTime === "later"}
                  onChange={() => setPublishTime("later")}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500 mr-2"
                />
                <span className="text-base">Schedule for later</span>
              </label>
            </div>
            {publishTime === "later" ? <div className="flex space-x-2 mb-4">
              <label className="block text-gray-700 text-[13px]">
                Start date *
                <input type="date" className="w-full border rounded-md p-2" />
              </label>
              <label className="block text-gray-700 text-[13px]">
                Start time
                <input type="time" className="w-full border rounded-md p-2" />
              </label>
            </div> : <></>}
            
            <h2 className="text-lg font-semibold mb-4">
              Check out these tips before you publish{" "}
              <i className="fas fa-lightbulb text-yellow-500"></i>
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Create promo codes for your event{" "}
                  <i className="fas fa-arrow-right"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Customize your order form{" "}
                  <i className="fas fa-arrow-right"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Add this event to a collection to increase visibility{" "}
                  <i className="fas fa-arrow-right"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Develop a safety plan for your event{" "}
                  <i className="fas fa-arrow-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className=" mb-6 absolute right-[8px] ">
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md ">
          Publish now
        </button>
      </div>
    </div>
  );
};
const EventPublishing = ({ eventData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-gray-50 p-2 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Your event is almost ready to publish
      </h1>
      <p className="text-gray-600 mb-6">
        Review your settings and let everyone find your event.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-100 p-3 rounded-lg">
          <div className="bg-white p-4 rounded-[20px] shadow-md mb-4 text-[14px] relative">
            <div className="flex items-center justify-center h-48 bg-gray-200 rounded-lg mb-4">
              <img
                src={eventData.event_image}
                alt={eventData.event_name}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {eventData.event_name}
            </h2>
              <p className="font-semibold text-gray-600 text-[13px] mb-1">
                {new Date(eventData.event_start).toLocaleString()} -{" "}
                {new Date(eventData.event_end).toLocaleString()}
              </p>
              <p className="text-gray-600 text-[13px] mb-1">{eventData.event_location}</p>

            <div className="flex items-center text-gray-600 mt-2 space-x-4 justify-between">
              <div className="space-x-4">
              <span className="font-semibold text-[12px] ">
                <i class="fa-solid fa-ticket mr-2"></i>
                200.00 VND
              </span>
              <span className="font-semibold text-[12px]">
                <i className="far fa-user mr-2"></i>
                300
              </span>
              </div>
              <div className="text-blue-600 hover:curso-pointer">
              <a href="#">Preview</a>
              <i class="fa-solid fa-up-right-from-square ml-2"></i>
            </div>
            </div>
            
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Organized by</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={eventData.event_host}
              readOnly
            />
          </div>
        </div>

        {/* Event Type & Tags Section */}
        <div className="flex-1 bg-gray-100 p-2 rounded-lg">
          <div className="mb-6">
            <h3 className="text-gray-900 font-semibold mb-2">
              Event type and category
            </h3>
            <p className="text-gray-600 mb-4">
              Your type and category help your event appear in more searches.
            </p>
            <select className="w-full p-2 border border-gray-300 rounded-lg mb-4">
              <option value="1">Conference</option>
              <option value="2">Seminar or Talk</option>
              <option value="3">Tradeshow, Consumer Show, or Expo</option>
              <option value="4">Convention</option>
              <option value="5">Festival or Fair</option>
              <option value="6">Concert or Performance</option>
              <option value="7">Screening</option>
              <option value="8">Dinner or Gala</option>
              <option value="9">Class, Training, or Workshop</option>
              <option value="10">Meeting or Networking Event</option>
              <option value="11">Party or Social Gathering</option>
              <option value="12">Rally</option>
              <option value="13">Tournament</option>
              <option value="14">Game or Competition</option>
              <option value="15">Race or Endurance Event</option>
              <option value="16">Tour</option>
              <option value="17">Attraction</option>
              <option value="18">Camp, Trip, or Retreat</option>
              <option value="19">Appearance or Signing</option>
              <option value="100">Other</option>
            </select>
            <div className="flex gap-4">
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="103">Music</option>
                <option value="101">Business &amp; Professional</option>
                <option value="110">Food &amp; Drink</option>
                <option value="113">Community &amp; Culture</option>
                <option value="105">Performing &amp; Visual Arts</option>
                <option value="104">Film, Media &amp; Entertainment</option>
                <option value="108">Sports &amp; Fitness</option>
                <option value="107">Health &amp; Wellness</option>
                <option value="102">Science &amp; Technology</option>
                <option value="109">Travel &amp; Outdoor</option>
                <option value="111">Charity &amp; Causes</option>
                <option value="114">Religion &amp; Spirituality</option>
                <option value="115">Family &amp; Education</option>
                <option value="116">Seasonal &amp; Holiday</option>
                <option value="112">Government &amp; Politics</option>
                <option value="106">Fashion &amp; Beauty</option>
                <option value="117">Home &amp; Lifestyle</option>
                <option value="118">Auto, Boat &amp; Air</option>
                <option value="119">Hobbies &amp; Special Interest</option>
                <option value="199">Other</option>
                <option value="120">School Activities</option>
              </select>

              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="4001">TV</option>
                <option value="4002">Film</option>
                <option value="4003">Anime</option>
                <option value="4004">Gaming</option>
                <option value="4005">Comics</option>
                <option value="4006">Adult</option>
                <option value="4007">Comedy</option>
                <option value="4999">Other</option>
              </select>
            </div>
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Tags</h3>
            <p className="text-gray-600 mb-4">
              Help people discover your event by adding tags related to your
              event’s theme, topic, vibe, location, and more.
            </p>
            <TagsInput />
          </div>
        </div>
      </div>
      <PublishSettings />
    </div>
  );
};
export default EventPublishing;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";

const AddTicket = () => {
  const [ticketType, setTicketType] = useState("Paid");
  const [showForm, setShowForm] = useState(false);
  const [showOverview, setShowOverView] = useState(false);
  const navigate = useNavigate();
  const handleTicketClick = (type) => {
    setTicketType(type);
    setShowForm(true);
  };
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const TicketPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64">
        <button
          onClick={onClose}
          className="absolute text-gray-500 text-sm mb-2 right-2"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div className="space-y-4">
          {[
            { icon: "ticket-alt", color: "blue", label: "Paid" },
            { icon: "scissors", color: "purple", label: "Free" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-2"
              onClick={() => setShowForm(true)}
            >
              <div className={`bg-${item.color}-100 p-2 rounded-lg`}>
                <i className={`fas fa-${item.icon} text-${item.color}-600`}></i>
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const [tickets, setTickets] = useState([]);
  const [ticketData, setTicketData] = useState({
    name: "",
    quantity: 0,
    price: 0,
    type: "Paid",
    salesStart: "",
    startTime: "",
    salesEnd: "",
    endTime: "",
  });

  const handleSaveTicket = () => {
    setTickets([...tickets, ticketData]);
    setShowForm(false);
    setShowOverView(true);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col lg:flex-row bg-gray-50  relative">
      {/* Main Content */}
      <main className="relative flex-1 p-6 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create tickets
        </h1>
        <p className="text-gray-600 mb-6">
          Choose a ticket type or build a section with multiple ticket types.
        </p>
        {!showOverview ? (
          <div className="space-y-4">
            {["Paid", "Free"].map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4  rounded-[6px] shadow-sm cursor-pointer w-2/4 border border-gray-300"
                onClick={() => handleTicketClick(type)}
              >
                <div className="flex items-center">
                  {type === "Paid" ? (
                    <svg
                      width="63"
                      height="63"
                      viewBox="0 0 63 63"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="63"
                        height="63"
                        rx="8"
                        fill="#3659E3"
                        fillOpacity="0.08"
                      ></rect>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M34.65 14.175C34.65 14.175 34.65 19.6875 29.925 19.6875C25.2 19.6875 25.2 14.175 25.2 14.175H17.325V45.675H25.2C25.1747 44.4468 25.6384 43.259 26.4891 42.3728C27.3399 41.4866 28.5078 40.9748 29.736 40.95H29.925C31.1532 40.9247 32.341 41.3884 33.2272 42.2391C34.1134 43.0899 34.6252 44.2578 34.65 45.486V45.675H42.525V14.175H34.65ZM44.1 17.325V47.25H37.8V48.825H45.675V17.325H44.1ZM26.9325 47.2503C27.4409 45.3611 28.7707 43.8 30.555 42.9978C31.1169 43.233 31.6062 43.6135 31.9725 44.1003C29.8673 44.7219 28.4037 46.6309 28.35 48.8253H20.475V47.2503H26.9325ZM25.2 30.7125V29.1375H22.05V30.7125H25.2ZM28.35 30.7125V29.1375H31.5V30.7125H28.35ZM37.8 29.1375H34.65V30.7125H37.8V29.1375ZM36.225 44.1H40.95V15.75H36.225C35.595 18.4275 33.8625 21.2625 29.925 21.2625C25.9875 21.2625 24.255 18.4275 23.625 15.75H18.9V44.1H23.625C24.1956 41.1381 26.9218 39.0935 29.925 39.375C32.9282 39.0935 35.6543 41.1381 36.225 44.1Z"
                        fill="#6898F7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="63"
                      height="63"
                      viewBox="0 0 63 63"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="63"
                        height="63"
                        rx="6.38"
                        fill="#F2E7FE"
                        fillOpacity="0.8"
                      ></rect>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M36.0746 26.775H39.5489C39.4388 24.066 36.3104 21.5775 33.0248 20.7743V17.325H29.8807V20.727C29.0476 20.916 28.1672 21.1995 27.4598 21.5775L29.7707 23.8928C30.4152 23.625 31.2013 23.4675 32.1445 23.4675C34.9428 23.4675 35.9803 24.8063 36.0746 26.775ZM18.8764 20.9947L24.2842 26.4127C24.2842 29.6887 26.7366 31.4685 30.4309 32.571L35.9488 38.0992C35.4143 38.8552 34.2982 39.5325 32.1445 39.5325C28.906 39.5325 27.6327 38.0835 27.4598 36.225H24.0012C24.1899 39.6742 26.8624 41.6115 29.8807 42.2572V45.675H33.0248V42.2887C34.534 42.0052 37.3637 41.4225 38.3541 40.5247L41.844 44.0212L44.0763 41.7847L21.1087 18.7582L18.8764 20.9947Z"
                        fill="#9374E7"
                      ></path>
                    </svg>
                  )}

                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{type}</h2>
                    <p className="text-gray-600">
                      {type === "Donation"
                        ? "Let people pay any amount."
                        : `Create a ${type.toLowerCase()} ticket.`}
                    </p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-4 flex">
            <div className="w-2/3 pr-4">
              {tickets.map((ticket, index) => (
                <div className="mt-2 bg-white  rounded-[5px] p-4 border border-gray-400">
                  <div key={index} className=" mb-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 pb-2 ">
                          {ticket.name}
                        </h2>
                        <div className="flex items-center space-x-4 pb-2">
                          <span className="text-gray-500">
                            Sold: 0/{ticket.quantity}
                          </span>
                          <span className="text-gray-500">${ticket.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 border-t border-t-gray-500 pt-4 justify-between">
                        <div className="flex items-center ">
                          <span className="text-green-500 mr-2">•</span>
                          <span>On Sale</span>
                          <span className="mx-2">•</span>
                          <span>
                            Ends {ticket.salesEnd} at {ticket.endTime}
                          </span>
                        </div>
                        <i class="fa-solid fa-pen-to-square hover:text-blue-600 hover:cursor-pointer"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/3 flex flex-col items-end">
              <div className="relative top-4 right-4">
                <button
                  onClick={() => setPopupOpen(!isPopupOpen)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Add Ticket <i className="fas fa-caret-down"></i>
                </button>
                <TicketPopup
                  isOpen={isPopupOpen}
                  onClose={() => setPopupOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-end p-4 rounded-lg cursor-pointer w-2/4 absolute bottom-20 right-4">
          <button
            className="bg-orange-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/publicEvent")}
          >
            Save and continue
          </button>
        </div>
      </main>

      {/* Add Tickets Form */}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-1/3 max-h-[700px] mt-[55px] border border-t-2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Let's create tickets
          </h2>

          <div className="flex space-x-4 mb-4">
            {["Paid", "Free"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-md ${
                  ticketType === type
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTicketType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700">
              Name *
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={ticketData.name}
                onChange={(e) =>
                  setTicketData({ ...ticketData, name: e.target.value })
                }
              />
            </label>
            <label className="block text-gray-700">
              Available quantity *
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={ticketData.quantity}
                onChange={(e) =>
                  setTicketData({ ...ticketData, quantity: e.target.value })
                }
              />
            </label>
            {ticketType === "Paid" ? (
              <label className="block text-gray-700">
                Price *
                <div className="flex items-center">
                  <span className="bg-gray-200 px-4 py-2 rounded-l-md border border-r-0 border-gray-300">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full border rounded-r-md p-2"
                    value={ticketData.price}
                    onChange={(e) =>
                      setTicketData({ ...ticketData, price: e.target.value })
                    }
                  />
                </div>
              </label>
            ) : (
              <></>
            )}

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-gray-700">
                Sales start *
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={ticketData.salesStart}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, salesStart: e.target.value })
                  }
                />
              </label>
              <label className="block text-gray-700">
                Start time
                <input
                  type="time"
                  className="w-full border rounded-md p-2"
                  value={ticketData.startTime}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, startTime: e.target.value })
                  }
                />
              </label>
              <label className="block text-gray-700">
                Sales end *
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={ticketData.salesEnd}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, salesEnd: e.target.value })
                  }
                />
              </label>
              <label className="block text-gray-700">
                End time
                <input
                  type="time"
                  className="w-full border rounded-md p-2"
                  value={ticketData.endTime}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, endTime: e.target.value })
                  }
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded-md"
              onClick={handleSaveTicket}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionEvent from "./SectionEvent";
import UploadContainer from "./UploadImg";
import DatetimeLocation from "./EventDateLocate";
import OverviewSection from "./OverviewSection";
import Loader from "../../components/Loading";

const EventOverview = () => {
  const [eventTitle, setEventTitle] = useState(
    "Mental Health First Aid (MHFA) Training (CPD Accredited)"
  );
  const [summary, setSummary] = useState(
    "Join our MHFA course to learn vital mental health first aid skills, supporting others in times of crisis with confidence and compassion."
  );

  return (
    <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4">
      <h1 className="text-2xl font-bold mb-6">Event Overview</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Event title</h2>

        <label className="block">
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </label>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>

        <label className="block">
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
            rows="3"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
        <div className="text-right text-gray-600 mt-1">
          {summary.length} / 140
        </div>
      </div>

      <div className="text-blue-500 flex items-center">
        <i className="fas fa-bolt mr-2"></i>
        <a href="#" className="font-semibold">
          Suggest summary
        </a>
      </div>
    </div>
  );
};
const EventForm = () => {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [showOverview, setShowOverView] = useState(false);
  const [eventTitle, setEventTitle] = useState(
    "Mental Health First Aid (MHFA) Training (CPD Accredited)"
  );
  const [summary, setSummary] = useState(
    "Join our MHFA course to learn vital mental health first aid skills, supporting others in times of crisis with confidence and compassion."
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-3xl mx-auto p-4 ">
    {/* Image Upload Section */}
    <UploadContainer />

    {/* Event Overview Section */}
    {!showOverview ? (
      <div
        className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4"
        onClick={() => setShowOverView(true)}
      >
        <h2 className="text-5xl font-semibold mb-2">{eventTitle}</h2>
        <span>{summary}</span>
      </div>
    ) : (
      <EventOverview />
    )}

    {/* Date and Location Section */}
    <SectionEvent />
    <DatetimeLocation />
    {/* Overview Section */}
    <OverviewSection />
  

    {/* Save Button */}
    <div className="text-right">
      <button
        className="bg-orange-600 text-white px-6 py-2 rounded-lg"
        onClick={() => navigate("/addTicket")}
      >
        Save and continue
      </button>
    </div>
  </div>
  );
};

export default EventForm;
import { useState } from "react";
import { FaBold, FaItalic, FaLink, FaListUl, FaTrashAlt, FaImage, FaVideo, FaAlignLeft } from "react-icons/fa";

const Overview = ({ setShowOverview, content, setContent }) => {
  const [text, setText] = useState(content.text);
  const [media, setMedia] = useState(content.media);

  const handleMediaUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map(file => ({
      type,
      url: URL.createObjectURL(file)
    }));
    setMedia(prev => [...prev, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    setContent({ text, media });
    setShowOverview(false);
  };

  return (
    <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4">
      <h1 className="text-2xl font-bold mb-2">Overview</h1>
      <p className="text-gray-600 mb-4">Add details about your event.</p>
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span>Text Formatting</span>
          <div className="flex space-x-2">
            <FaBold /> <FaItalic /> <FaLink /> <FaListUl />
          </div>
        </div>
        <textarea
          className="w-full h-32 border rounded-lg p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <FaTrashAlt className="text-gray-500 cursor-pointer" onClick={() => setText("")} />
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <label className="cursor-pointer border px-4 py-2 rounded flex items-center">
          <FaImage className="mr-2" /> Add image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'image')} />
        </label>
        <label className="cursor-pointer border px-4 py-2 rounded flex items-center">
          <FaVideo className="mr-2" /> Add video
          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'video')} />
        </label>
      </div>
      <div className="mb-4">
        {media.map((item, index) => (
          <div key={index} className="relative inline-block mx-4">
            {item.type === "image" ? (
              <img src={item.url} alt="Uploaded" className="w-full max-w-xs rounded-lg mt-2" />
            ) : (
              <video src={item.url} controls className="w-full max-w-xs rounded-lg mt-2"></video>
            )}
            <FaTrashAlt
              className="absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer"
              onClick={() => handleDeleteMedia(index)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleComplete}>Complete</button>
      </div>
    </div>
  );
};

const OverviewSection = () => {
  const [showOverview, setShowOverview] = useState(false);
  const [content, setContent] = useState({ text: "", media: [] });

  return (
    <div>
      {!showOverview ? (
        <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4" onClick={() => setShowOverview(true)}>
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-600">{content.text || "Click to add details"}</p>
          <div className="mt-2">
            {content.media.map((item, index) => (
              <div key={index}>
                {item.type === "image" ? (
                  <img src={item.url} alt="Uploaded" className="w-full max-w-xs rounded-lg mt-2" />
                ) : (
                  <video src={item.url} controls className="w-full max-w-xs rounded-lg mt-2"></video>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Overview setShowOverview={setShowOverview} content={content} setContent={setContent} />
      )}
    </div>
  );
};

export default OverviewSection;
import React, { useState } from "react";

const LocationForm = ({ formData, setFormData }) => {
  return (
    <div className="max-w-4xl bg-white rounded-lg w-full">
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Venue Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.venueName}
            onChange={(e) =>
              setFormData({ ...formData, venueName: e.target.value })
            }
            placeholder="Venue Name"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const Detail = ({ formData, setFormData, setShowDetail }) => {
  const handleComplete = () => {
    setShowDetail(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <h1 className="text-2xl font-bold mb-6">Date and Location</h1>
      <div className="mb-6">
        <label className="block text-gray-700">Date and time</label>
        <div className="flex space-x-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>
      </div>
      <label className="block text-gray-700 mb-2">Location</label>
      <div className="flex space-x-4 mb-2">
        <button
          className={`flex items-center p-4 border rounded-lg w-1/3 ${
            formData.locationType === "venue"
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300"
          }`}
          onClick={() => setFormData({ ...formData, locationType: "venue" })}
        >
          <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
          <p className="font-semibold">Venue</p>
        </button>
        <button
          className={`flex items-center p-4 border rounded-lg w-1/3 ${
            formData.locationType === "online"
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300"
          }`}
          onClick={() => setFormData({ ...formData, locationType: "online" })}
        >
          <i className="fas fa-video text-blue-500 mr-2"></i>
          <p className="font-semibold">Online Event</p>
        </button>
      </div>
      {formData.locationType !== "online" && (
        <LocationForm formData={formData} setFormData={setFormData} />
      )}
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleComplete}
      >
        Complete
      </button>
    </div>
  );
};

const OverView = ({ formData, setShowDetail }) => {
  return (
    <div
      className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4"
      onClick={() => setShowDetail(true)}
    >
      <div className="flex justify-start items-center mb-4">
        <h2 className="text-2xl font-semibold">Date and time</h2>
        <h2 className="text-2xl font-semibold ml-16">Location</h2>
      </div>

      <div className="flex justify-start  items-start mb-4">
        <div className="flex items-start">
          <i className="far fa-calendar-alt text-xl mr-2"></i>
          <div>
            <p className="font-medium">{formData.date}</p>
            <p className="text-gray-500">
              {formData.startTime} - {formData.endTime}
            </p>
          </div>
        </div>
        <div className="flex items-start ml-[90px]">
          <i className="fas fa-map-marker-alt text-xl mr-2"></i>

          <div>
            {formData.locationType !== "online" && (
              <p lassName="font-medium">
                {formData.venueName}, {formData.address}, {formData.city}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DatetimeLocation = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    locationType: "online",
    venueName: "",
    address: "",
    city: "",
  });

  return (
    <div>
      {showDetail ? (
        <Detail
          formData={formData}
          setFormData={setFormData}
          setShowDetail={setShowDetail}
        />
      ) : (
        <OverView formData={formData} setShowDetail={setShowDetail} />
      )}
    </div>
  );
};

export default DatetimeLocation;
import { useState, useRef } from "react";
import { FaUser, FaList } from "react-icons/fa";

const SectionEvent = () => {
  const [slots, setSlots] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [desc, setDesc] = useState(false);
  const [artist, setArtist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const addSectionRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      addSectionRef.current &&
      !addSectionRef.current.contains(event.target)
    ) {
      if (title.trim() !== "" && startTime && endTime) {
        setSlots([...slots, { title, startTime, endTime, description }]);
        setTitle("");
        setStartTime("");
        setEndTime("");
        setDescription("");
        setDesc(false);
        setArtist(false);
        setIsAdding(false);
      }
    }
  };

  const handleAddSlot = () => {
    setIsAdding(true);
  };

  return (
    <div
      className="bg-white p-8 rounded-lg  border border-blue-500 max-w-[710px] w-full mb-4"
      onClick={handleClickOutside}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <button className="text-red-500">Delete section</button>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a
        time, a description of what will happen, and who will host or perform
        during the event.
      </p>
      <div className="flex items-center mb-4">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4">
          Agenda
        </button>
        <button className="text-gray-500 pb-1" onClick={handleAddSlot}>
          + Add new agenda
        </button>
      </div>

      {/* Danh sách agenda slots */}
      {slots.map((slot, index) => (
        <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
          <div className="border-red-500 border-l-2 pl-4">
            <div className="flex justify-between">
              <span className="text-red-500">
                {slot.startTime} - {slot.endTime}
              </span>
              <i className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"></i>
            </div>
            <span className="font-semibold text-gray-500 text-xl py-2">
              {slot.title}
            </span>
            <p className="text-gray-500 border-t-2 pt-2">{slot.description}</p>
          </div>
        </div>
      ))}

      {/* Form thêm slot */}
      {isAdding && (
        <div ref={addSectionRef} className="p-4 border border-gray-300 rounded-lg">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2" htmlFor="start-time">
                Start time
              </label>
              <input
                type="time"
                id="start-time"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2" htmlFor="end-time">
                End time
              </label>
              <input
                type="time"
                id="end-time"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            {!desc ? (
              <button
                className="flex items-center text-gray-600 mt-2 text-[14px] mb-2"
                onClick={() => setDesc(true)}
              >
                <FaList className="mr-2" /> Add description
              </button>
            ) : (
              <div>
                <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="text-right text-gray-400 text-xs">
                  {description.length} / 1000
                </div>
              </div>
            )}
            {!artist ? (
              <button
                className="flex items-center text-gray-600 mt-2 text-[14px] mb-2"
                onClick={() => setArtist(true)}
              >
                <FaUser className="mr-2" /> Add Artist
              </button>
            ) : (
              <div>
                <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                  Artist
                </label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
                <div className="text-right text-gray-400 text-xs">
                  {artist.length} / 1000
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg text-center mt-4">
        <button className="text-blue-600 w-full" onClick={handleAddSlot}>
          + Add slot
        </button>
      </div>
    </div>
  );
};

export default SectionEvent;
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const UploadMedia = ({ setShowUpload, setUploadedImages }) => {
  const [images, setImages] = useState([]);
  const [cropImage, setCropImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) return;

    const newImages = files.map((file) => URL.createObjectURL(file));
    setCropImage(newImages[0]); 
    setShowCropper(true);
  };

  const onCropComplete = useCallback(async (croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
    const croppedImg = await getCroppedImg(cropImage, croppedPixels);
    setCroppedPreview(croppedImg); 
  }, [cropImage]);

  const getCroppedImg = async (imageSrc, cropArea) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleSaveCrop = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
    setImages([...images, croppedImg]);
    setUploadedImages([...images, croppedImg]); 
    setShowCropper(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4 ">
      <h1 className="text-2xl font-semibold mb-4">Add images</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Images</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mb-2">
        <img
              src="https://mybic.vn/uploads/news/default/no-image.png"
              alt="Placeholder"
              className="mb-4"
              width="160"
              height="120"
            />
          <input
            type="file"
            accept="image/jpeg, image/png"
            multiple
            className="hidden"
            id="upload-input"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-input" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer">
            Upload Images
          </label>
          
        </div>
        <p className="text-sm text-gray-600">
          • Recommended image size: 2160 x 1080px • Maximum file size: 10MB •
          Supported image files: JPEG, PNG
        </p>
        <div className="flex gap-2 mt-4">
          {images.map((img, index) => (
            <img key={index} src={img} alt="Uploaded" className="w-24 h-24 object-cover rounded-md" />
          ))}
        </div>
      </div>

      <button onClick={() => setShowUpload(false)} className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4">
        Complete
      </button>

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-5xl min-h-3xl w-full flex">
            {/* Khu vực Crop */}
            <div className="w-2/3 pr-4 border-r">
              <h2 className="text-lg font-semibold mb-4">Adjust Image</h2>
              <div className="relative w-full h-[400px]">
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={2 / 1}
                  cropShape="rect"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            </div>

            {/* Khu vực Xem trước */}
            <div className="w-1/3 pl-4">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="flex flex-col items-center gap-4">
                {croppedPreview && (
                  <>
                    <img src={croppedPreview} alt="Square Preview" className="w-36 h-36 object-cover rounded-md border" />
                    <img src={croppedPreview} alt="Rectangle Preview" className="w-64 h-32 object-cover rounded-md border" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-4">
            <button onClick={() => setShowCropper(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
            <button onClick={handleSaveCrop} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

const UploadedImagesSlider = ({ images }) => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false}>
      {images.map((img, index) => (
        <div key={index} className="relative max-w-[710px] min-h-[400px] mb-4">
          <img src={img} alt={`Uploaded ${index}`} className="w-full h-[400px] object-cover" />
        </div>
      ))}
    </Carousel>
  );
};

const UploadContainer = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <div>
      {!showUpload ? (
        uploadedImages.length > 0 ? (
          <UploadedImagesSlider images={uploadedImages} />
        ) : (
          <div
            className="relative bg-gray-200 rounded-lg overflow-hidden mb-6 max-w-[710px] min-h-[400px] flex items-center justify-center cursor-pointer"
            onClick={() => setShowUpload(true)}
          >
            <img
              src="https://storage.googleapis.com/a1aa/image/oFssrRGOqYsjeanal5Ggc6TQow520FnOxiqapc7K5xs.jpg"
              alt="A busy event with people socializing in a large room"
              className="w-full h-[400px] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-75 p-6 rounded-lg text-center">
                              <i className="fas fa-upload text-2xl text-blue-500 mb-2"></i>
                              <p className="text-blue-500">Upload photos</p>
                            </div>
            </div>
          </div>

        )
      ) : (
        <UploadMedia setShowUpload={setShowUpload} setUploadedImages={setUploadedImages} />
      )}
    </div>
  );
};

export default UploadContainer;

// Hàm tạo ảnh từ URL để vẽ lên canvas
const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
