import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAuth } from "../Auth/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const TagsInput = ({ tags, setTags, isReadOnly }) => { 
  const removeTag = (tagToRemove) => {
    if (isReadOnly) return; 
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full max-w-xl p-4 mb-4 border rounded-md tags-container">
      <div className="flex flex-wrap gap-2 tags-list">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full tag"
          >
            <span className="text-gray-600 text-[14px]">{tag}</span>
            {!isReadOnly && ( 
              <button
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-gray-900"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </span>
        ))}
      </div>
      {!isReadOnly && ( 
        <div className="mt-3">
          <label htmlFor="eventTags" className="text-sm text-gray-600">
            Add search keywords to your event
          </label>
          <input
            id="eventTags"
            type="text"
            name="event.tags"
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="Type and press Enter"
            disabled={isReadOnly}
            onKeyDown={(e) => {
              if (isReadOnly) return; 
              if (e.key === "Enter" && e.target.value) {
                setTags([...tags, e.target.value]);
                e.target.value = "";
              }
            }}
          />
        </div>
      )}
      <div className="mt-2 text-sm text-gray-500">{tags.length}/10 tags</div>
    </div>
  );
};

const PublishSettings = ({ refunds, setRefunds, validityDays, setValidityDays, isReadOnly }) => {
  const handleChange = (event) => {
    if (isReadOnly) return;
    setValidityDays(event.target.value);
  };

  return (
    <div className="relative w-full max-w-4xl mt-8 mb-4">
      <h1 className="mb-6 text-2xl font-bold">Publish settings</h1>
      <div className="flex flex-col mb-10 md:flex-row">
        <div className="flex-1">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Set your refund policy</h2>
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
                  onChange={() => !isReadOnly && setRefunds("yes")} 
                  disabled={isReadOnly}
                  className="w-4 h-4 mr-2 border-2 border-orange-500 accent-red-500"
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
                  onChange={() => !isReadOnly && setRefunds("no")} 
                  disabled={isReadOnly}
                  className="w-4 h-4 mr-2 border-2 border-orange-500 accent-red-500"
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
                    disabled={isReadOnly}
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
        <div className="flex-1 mt-6 md:mt-0 md:ml-6"></div>
      </div>
    </div>
  );
};

const EventPublishing = ({ event, setEvent, onPublish, isReadOnly }) => {
  const [loading, setLoading] = useState(true);
  const [eventTypes, setEventTypes] = useState([]);
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [organizerName, setOrganizerName] = useState("");

  // Fetch event types from API
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/events-type/get-all-event-types", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const types = response.data;
        console.log("Fetched event types:", types); // Ghi log để debug
        if (!types || types.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Không có loại sự kiện nào được tải. Vui lòng kiểm tra API.",
          });
        }
        setEventTypes(types);
      } catch (err) {
        console.error("Error fetching event types:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách loại sự kiện.",
        });
      }
    };
    fetchEventTypes();
  }, [token]);

  // Kiểm tra đồng bộ eventType với eventTypes
  useEffect(() => {
    if (event.eventType && eventTypes.length > 0) {
      const selectedType = eventTypes.find((type) => String(type.id) === String(event.eventType));
      if (!selectedType) {
        console.warn("Selected eventType not found in eventTypes:", event.eventType);
        setEvent((prev) => ({ ...prev, eventType: "" }));
      }
    }
  }, [eventTypes, event.eventType, setEvent]);

  // Fetch organizer name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/user/${user.email}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedOrganizerName = response.data.organizer?.organizerName || "Unknown Organizer";
        setOrganizerName(fetchedOrganizerName);
        setEvent((prev) => ({ ...prev, eventHost: fetchedOrganizerName }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setOrganizerName("Unknown Organizer");
        setEvent((prev) => ({ ...prev, eventHost: "Unknown Organizer" }));
      }
    };
    fetchUserData();
  }, [user.email, token, setEvent]);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const getImageUrl = (item) => {
    if (item instanceof File || item instanceof Blob) {
      return URL.createObjectURL(item);
    } else if (typeof item === "string") {
      return item.startsWith("http")
        ? item
        : `https://res.cloudinary.com/dho1vjupv/image/upload/${item}`;
    }
    return "https://mybic.vn/uploads/news/default/no-image.png";
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 bg-gray-50">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Your event is almost ready to publish
      </h1>
      <p className="mb-6 text-gray-600">
        Review your settings and let everyone find your event.
      </p>

      {isReadOnly && (
        <p className="mb-4 text-red-500">
          The event has been completed, can only be viewed, cannot be edited.
        </p>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 p-3 bg-gray-100 rounded-lg">
          <div className="bg-white p-4 rounded-[20px] shadow-md mb-4 text-[14px] relative">
            <div className="flex items-center justify-center h-48 mb-4 rounded-lg">
              {event.uploadedImages?.length > 0 ? (
                <div className="relative mb-4">
                  <img
                    src={getImageUrl(event.uploadedImages[0])}
                    alt="Uploaded Event Image"
                    className="w-[448px] h-[192px] object-cover rounded-[14px]"
                  />
                </div>
              ) : (
                <img
                  src="https://mybic.vn/uploads/news/default/no-image.png"
                  alt="Placeholder"
                  className="w-[448px] h-[192px] object-cover rounded-[14px]"
                />
              )}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {event.eventName || "Untitled Event"}
            </h2>
            <p className="font-semibold text-gray-600 text-[13px] mb-1">
              {event.eventLocation.date && event.eventLocation.startTime
                ? `${new Date(
                    event.eventLocation.date
                  ).toLocaleDateString()} ${event.eventLocation.startTime} - ${
                    event.eventLocation.endTime
                  }`
                : "Date and time not set"}
            </p>
            <p className="text-gray-600 text-[13px] mb-1">
              {event.eventLocation.locationType === "online"
                ? "Online Event"
                : `${event.eventLocation.venueName}, ${event.eventLocation.address}, ${event.eventLocation.city}`}
            </p>
            <div className="flex items-center justify-between mt-2 space-x-4 text-gray-600">
              <div className="space-x-4">
                <span className="font-semibold text-[12px]">
                  <i className="mr-2 fa-solid fa-ticket"></i>
                  {event.tickets[0]?.price ? `${event.tickets[0].price} VND` : "Free"}
                </span>
                <span className="font-semibold text-[12px]">
                  <i className="mr-2 far fa-user"></i>
                  {event.tickets[0]?.quantity || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Organized by</h3>
            <div className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg bg-gray-50">
              {organizerName || "Loading..."}
            </div>
          </div>
        </div>

        <div className="flex-1 p-2 bg-gray-100 rounded-lg">
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-gray-900">
              Event type and category
            </h3>
            <p className="mb-4 text-gray-600">
              Your type and category help your event appear in more searches.
            </p>
            {eventTypes.length === 0 ? (
              <p className="text-red-500">
                No event types available. Please try again later.
              </p>
            ) : (
              <select
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                value={event.eventType || ""}
                onChange={(e) =>
                  !isReadOnly && setEvent((prev) => ({ ...prev, eventType: e.target.value })) // Kiểm tra isReadOnly
                }
                disabled={isReadOnly}
              >
                <option value="">Select Type</option>
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Tags</h3>
            <p className="mb-4 text-gray-600">
              Help people discover your event by adding tags related to your
              event’s theme, topic, vibe, location, and more.
            </p>
            <TagsInput
              tags={event.tags}
              setTags={(newTags) =>
                !isReadOnly && setEvent((prev) => ({ ...prev, tags: newTags })) 
              }
              isReadOnly={isReadOnly}
            />
          </div>
        </div>
      </div>
      <PublishSettings
        refunds={event.refunds}
        setRefunds={(value) =>
          !isReadOnly && setEvent((prev) => ({ ...prev, refunds: value })) 
        }
        validityDays={event.validityDays}
        setValidityDays={(value) =>
          !isReadOnly && setEvent((prev) => ({ ...prev, validityDays: value }))
        }
        isReadOnly={isReadOnly} 
      />
      <div className="mb-6">
        {!isReadOnly && ( 
          <button
            onClick={onPublish}
            className="px-4 py-2 text-white bg-orange-600 rounded-md"
          >
            Publish now
          </button>
        )}
      </div>
    </div>
  );
};

export default EventPublishing;