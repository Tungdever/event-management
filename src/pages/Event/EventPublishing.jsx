import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
const TagsInput = ({ tags, setTags }) => {
  
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
const PublishSettings = ({
  eventVisibility,
  setEventVisibility,
  publishTime,
  setPublishTime,
  refunds,
  setRefunds,
  validityDays,
  setValidityDays,
}) => {


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
const EventPublishing = ({
  eventData,
  tags,
  setTags,
  eventVisibility,
  setEventVisibility,
  publishTime,
  setPublishTime,
  refunds,
  setRefunds,
  validityDays,
  setValidityDays,
}) => {
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
            <TagsInput tags={tags} setTags={setTags} />
          </div>
        </div>
      </div>
      <PublishSettings
              eventVisibility={eventVisibility}
              setEventVisibility={setEventVisibility}
              publishTime={publishTime}
              setPublishTime={setPublishTime}
              refunds={refunds}
              setRefunds={setRefunds}
              validityDays={validityDays}
              setValidityDays={setValidityDays}
            />
    </div>
  );
};
export default EventPublishing;
