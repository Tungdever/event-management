import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
              <i className="fa-solid fa-xmark"></i>
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
  const [selectedDate, setSelectedDate] = useState(""); 
  const handleChange = (event) => {
    setValidityDays(event.target.value);
  };



  return (
    <div className="w-full max-w-4xl mt-8 mb-4 relative">
      <h1 className="text-2xl font-bold mb-6">Publish settings</h1>
      <div className="flex flex-col md:flex-row mb-10">
        <div className="flex-1">
        
          {/* Refund policy */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Set your refund policy</h2>
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
            {refunds === "yes" && (
              <div className="flex flex-col gap-2">
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
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 mt-6 md:mt-0 md:ml-6">
       
        </div>
      </div>
    </div>
  );
};


const EventPublishing = ({ event, setEvent,onPublish }) => {
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
        <div className="flex-1 bg-gray-100 p-3 rounded-lg ">
          <div className="bg-white p-4 rounded-[20px] shadow-md mb-4 text-[14px] relative">
            <div className="flex items-center justify-center h-48 rounded-lg mb-4">
            {event.uploadedImages.map((img, index) => (
                    <div key={index} className="relative  mb-4">
                      <img
                        src={img}
                        alt={`Uploaded ${index}`}
                        className="w-[448px] h-[192px] object-cover rounded-[14px]"
                      />
                    </div>
                  ))}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {event.eventName || "Untitled Event"}
            </h2>
            <p className="font-semibold text-gray-600 text-[13px] mb-1">
              {event.eventLocation.date && event.eventLocation.startTime
                ? `${new Date(event.eventLocation.date).toLocaleDateString()} ${event.eventLocation.startTime} - ${event.eventLocation.endTime}`
                : "Date and time not set"}
            </p>
            <p className="text-gray-600 text-[13px] mb-1">
              {event.eventLocation.locationType === "online"
                ? "Online Event"
                : `${event.eventLocation.venueName}, ${event.eventLocation.address}, ${event.eventLocation.city}`}
            </p>
            <div className="flex items-center text-gray-600 mt-2 space-x-4 justify-between">
              <div className="space-x-4">
                <span className="font-semibold text-[12px]">
                  <i className="fa-solid fa-ticket mr-2"></i>
                  {event.tickets[0]?.price ? `${event.tickets[0].price} VND` : "Free"}
                </span>
                <span className="font-semibold text-[12px]">
                  <i className="far fa-user mr-2"></i>
                  {event.tickets[0]?.quantity || "N/A"}
                </span>
              </div>
              <div className="text-blue-600 hover:cursor-pointer">
                <a href="#">Preview</a>
                <i className="fa-solid fa-up-right-from-square ml-2"></i>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Organized by</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={event.eventHost || ""}
              onChange={(e) =>
                setEvent((prev) => ({ ...prev, eventHost: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Event Type & Tags Section */}
        <div className="flex-1 bg-gray-100 p-2 rounded-lg ">
          <div className="mb-6">
            <h3 className="text-gray-900 font-semibold mb-2">
              Event type and category
            </h3>
            <p className="text-gray-600 mb-4">
              Your type and category help your event appear in more searches.
            </p>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              value={event.eventType || ""}
              onChange={(e) =>
                setEvent((prev) => ({ ...prev, eventType: e.target.value }))
              }
            >
              <option value="">Select Type</option>
              <option value="Conference">Conference</option>
              <option value="Performing">Performing</option>
              <option value="Holidays">Holidays</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Business">Business</option>
              {/* Thêm các tùy chọn khác nếu cần */}
            </select>
            {/* <div className="flex gap-4">
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="103">Music</option>
               
              </select>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="4001">TV</option>
                <option value="4002">Film</option>
                
              </select>
            </div> */}
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Tags</h3>
            <p className="text-gray-600 mb-4">
              Help people discover your event by adding tags related to your
              event’s theme, topic, vibe, location, and more.
            </p>
            <TagsInput
              tags={event.tags}
              setTags={(newTags) =>
                setEvent((prev) => ({ ...prev, tags: newTags }))
              }
            />
          </div>
        </div>
      </div>
      <PublishSettings
        eventVisibility={event.eventVisibility}
        setEventVisibility={(value) =>
          setEvent((prev) => ({ ...prev, eventVisibility: value }))
        }
        publishTime={event.publishTime}
        setPublishTime={(value) =>
          setEvent((prev) => ({ ...prev, publishTime: value }))
        }
        refunds={event.refunds}
        setRefunds={(value) =>
          setEvent((prev) => ({ ...prev, refunds: value }))
        }
        validityDays={event.validityDays}
        setValidityDays={(value) =>
          setEvent((prev) => ({ ...prev, validityDays: value }))
        }
      />
      <div className="mb-6 ">
        <button
          onClick={onPublish} 
          className="bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Publish now
        </button>
      </div>
    </div>
  );
};

export default EventPublishing;