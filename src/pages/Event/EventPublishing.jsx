import { useState, useEffect } from "react";


const PublishSettings = () => {
  const [eventVisibility, setEventVisibility] = useState("public");
  const [publishTime, setPublishTime] = useState("now");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); 
  }, []);
  return (
    loading ?<h1></h1> :
    <div className="w-full max-w-4xl mt-8 mb-4 relative">
    <h1 className="text-2xl font-bold mb-6">Publish settings</h1>
    <div className="flex flex-col md:flex-row mb-10">
      <div className="flex-1">
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
                className="mr-2"
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
                className="mr-2"
              />
              <span className="text-base">Private</span>
            </label>
            <p className="text-sm text-gray-500 ml-6">
              Shared only with a select audience
            </p>
          </div>
        </div>
        <div>
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
                className="mr-2"
              />
              <span className="text-base">Publish now</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="publish_time"
                checked={publishTime === "later"}
                onChange={() => setPublishTime("later")}
                className="mr-2"
              />
              <span className="text-base">Schedule for later</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex-1 mt-6 md:mt-0 md:ml-6">
        <div className="bg-gray-100 p-4 rounded-lg">
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
      <button className="bg-gray-200 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed">
        Publish now
      </button>
    </div>
  </div>
  );
};
const EventPublishing = () => {
  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row justify-center items-start lg:items-stretch p-6 space-y-4 lg:space-y-0 lg:space-x-2 min-h-screen">
      {/* Left Section */}
      <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm">
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
        <ul>
          <li className="flex items-center mb-2">
            <i className="fas fa-check-circle text-blue-600 mr-2"></i>Build
            event page
          </li>
          <li className="flex items-center mb-2">
            <i className="far fa-circle text-gray-400 mr-2"></i>Online event
            page
          </li>
          <li className="flex items-center mb-2">
            <i className="far fa-dot-circle text-blue-600 mr-2"></i>Add tickets
          </li>
          <li className="flex items-center">
            <i className="far fa-circle text-gray-400 mr-2"></i>Publish
          </li>
        </ul>
      </aside>
      {/* Right Section */}
      <div className=" px-2 w-full lg:w-3/4">
        <div className="bg-gray-50 p-6 min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your event is almost ready to publish
            </h1>
            <p className="text-gray-600 mb-6">
              Review your settings and let everyone find your event.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Event Preview Section */}
              <div className="flex-1 bg-gray-100 p-6 rounded-lg">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <div className="flex items-center justify-center h-48 bg-gray-200 rounded-lg mb-4">
                    <i className="fas fa-image text-gray-400 text-4xl"></i>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Mental Health First Aid (MHFA) Training (CPD Accredited)
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Wednesday, April 16 · 10am - 12pm GMT+7
                  </p>
                  <p className="text-gray-600 mb-4">Online event</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <i className="far fa-user mr-2"></i>
                  </div>
                  <a href="#" className="text-blue-600">
                    Preview
                  </a>
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2">
                    Organized by
                  </h3>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Organizer"
                  />
                </div>
              </div>

              {/* Event Type & Tags Section */}
              <div className="flex-1 bg-gray-100 p-6 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-gray-900 font-semibold mb-2">
                    Event type and category
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your type and category help your event appear in more
                    searches.
                  </p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg mb-4">
                    <option>Type</option>
                  </select>
                  <div className="flex gap-4">
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Category</option>
                    </select>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      disabled
                    >
                      <option>Subcategory</option>
                    </select>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2">Tags</h3>
                  <p className="text-gray-600 mb-4">
                    Help people discover your event by adding tags related to
                    your event’s theme, topic, vibe, location, and more.
                  </p>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Add search keywords to your event"
                  />
                  <p className="text-gray-600 text-sm">0/10 tags</p>
                </div>
              </div>
            </div>
          <PublishSettings />
        </div>
      </div>
    </div>
  );
};
export default EventPublishing;
