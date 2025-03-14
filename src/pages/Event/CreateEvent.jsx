import React from "react";
import { useState } from "react";
import {
  FaTextHeight,
  FaBold,
  FaItalic,
  FaLink,
  FaListUl,
  FaTrashAlt,
  FaBolt,
  FaAlignLeft,
  FaImage,
  FaVideo,
} from "react-icons/fa";
import { FaClock, FaUser, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const [text, setText] = useState("");

  return (
    <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4 px-8">
    <h1 className="text-2xl font-bold mb-2">Overview</h1>
    <p className="text-gray-600 mb-4">
      Add more details about your event and include what people can expect
      if they attend.
    </p>
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FaTextHeight />
          <span>Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaBold />
          <FaItalic />
          <FaLink />
          <FaListUl />
        </div>
      </div>
      <textarea
        className="w-full h-32 border rounded-lg p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="flex justify-end mt-2">
        <FaTrashAlt
          className="text-gray-500 cursor-pointer"
          onClick={() => setText("")}
        />
      </div>
    </div>
    <div className="flex items-center text-blue-600 mb-4">
      <FaBolt className="mr-2" />
      <span>Suggest description</span>
    </div>
    <div className="flex justify-between">
      <button className="flex items-center w-[150px] justify-center border border-gray-600 rounded px-4 py-2">
        <FaAlignLeft className="mr-2" />
        <span>Add text</span>
      </button>
      <button className="flex items-center w-[150px] justify-center border border-gray-600 rounded px-4 py-2">
        <FaImage className="mr-2" />
        <span>Add image</span>
      </button>
      <button className="flex items-center w-[150px] justify-center border border-gray-600 rounded px-4 py-2">
        <FaVideo className="mr-2" />
        <span>Add video</span>
      </button>
    </div>
  </div>
  );
};
const  LocationForm =()=> {

  return (
    <div className="max-w-4xl bg-white rounded-lg  w-full">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Venue Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Venue Name"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Address 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Address 1"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Address 2</label>
              <input
                type="text"
                placeholder="Address 2"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">State/Province</label>
              <input
                type="text"
                placeholder="e.g. California"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
          
         
        </form>
      </div>
  );
}

const Sections = () => {
  const [title, setTitle] = useState("");

  return (
    <div className="bg-white p-8 rounded-lg  border border-blue-500 max-w-[710px] w-full mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Agenda</h1>
          <button className="text-red-600">Delete section</button>
        </div>
       
        <div className="flex items-center mb-4">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4">
            Agenda
          </button>
          <button className="text-gray-600 pb-1">+ Add new agenda</button>
        </div>
        <div className="border-b-2 border-blue-600 mb-4"></div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Start time</label>
            <button className="w-full border rounded p-2 flex items-center justify-center">
              <FaClock className="mr-2" /> Start time
            </button>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">End time</label>
            <button className="w-full border rounded p-2 flex items-center justify-center text-gray-400">
              <FaClock className="mr-2" /> End time
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <button className="flex items-center text-gray-600">
            <FaUser className="mr-2" /> Host or Artist
          </button>
          <button className="flex items-center text-gray-600">
            <FaList className="mr-2" /> Add description
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <button className="text-blue-600">+ Add slot</button>
        </div>
      </div>
  );
};

const EventPublishing = () => {
  return (
    <div className="bg-gray-50 p-6 min-h-screen flex justify-center items-center">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md w-full">
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
              <h3 className="text-gray-900 font-semibold mb-2">Organized by</h3>
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
                Your type and category help your event appear in more searches.
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
                Help people discover your event by adding tags related to your
                event’s theme, topic, vibe, location, and more.
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
      </div>
    </div>
  );
};

const DateLocation = () => {
  const [eventType, setEventType] = useState("single");
  const [locationType, setLocationType] = useState("online");

  return (
    <div className="bg-white p-8 rounded-lg  border border-blue-500 max-w-[710px] w-full mb-4">
      <h1 className="text-2xl font-bold mb-6">Date and Location</h1>

      {/* Event Type Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Type of Event</h2>
        <div className="flex space-x-4">
          <button
            className={`flex items-center p-4 border rounded-lg w-1/2 ${
              eventType === "single" ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setEventType("single")}
          >
            <i className="fas fa-calendar-day text-blue-500 mr-2"></i>
            <div>
              <p className="font-semibold">Single event</p>
              <p className="text-sm text-gray-500">
                For events that happen once
              </p>
            </div>
            {eventType === "single" && (
              <i className="fas fa-check-circle text-blue-500 ml-auto"></i>
            )}
          </button>
          <button
            className={`flex items-center p-4 border rounded-lg w-1/2 ${
              eventType === "recurring" ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setEventType("recurring")}
          >
            <i className="fas fa-calendar-alt text-gray-500 mr-2"></i>
            <div>
              <p className="font-semibold">Recurring event</p>
              <p className="text-sm text-gray-500">
                For timed entry and multiple days
              </p>
            </div>
            <span className="ml-2 bg-blue-100 text-blue-500 text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
            {eventType === "recurring" && (
              <i className="fas fa-check-circle text-blue-500 ml-auto"></i>
            )}
          </button>
        </div>
      </div>

      {/* Date and Time */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Date and location</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Date and time</label>
          <div className="flex space-x-4">
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              placeholder="Start time"
            />
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              placeholder="End time"
            />
          </div>
        </div>
      
      </div>

      {/* Location Selection */}
      <div>
        <label className="block text-gray-700 mb-2">Location</label>
        <div className="flex space-x-4 mb-2">
          <button
            className={`flex items-center p-4 border rounded-lg w-1/3 ${
              locationType === "venue"
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300"
            }`}
            onClick={() => setLocationType("venue")}
          >
            <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
            <p className="font-semibold">Venue</p>
          </button>
          <button
            className={`flex items-center p-4 border rounded-lg w-1/3 ${
              locationType === "online"
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300"
            }`}
            onClick={() => setLocationType("online")}
          >
            <i className="fas fa-video text-blue-500 mr-2"></i>
            <p className="font-semibold text-blue-500">Online event</p>
          </button>
          <button
            className={`flex items-center p-4 border rounded-lg w-1/3 ${
              locationType === "tba"
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300"
            }`}
            onClick={() => setLocationType("tba")}
          >
            <i className="fas fa-question-circle text-gray-500 mr-2"></i>
            <p className="font-semibold">To be announced</p>
          </button>
        </div>
        <LocationForm/>
      </div>
    </div>
  );
};

const  EventOverview =() => {
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
          <div className="text-right text-gray-600 mt-1">{summary.length} / 140</div>
        </div>

        <div className="text-blue-500 flex items-center">
          <i className="fas fa-bolt mr-2"></i>
          <a href="#" className="font-semibold">Suggest summary</a>
        </div>
      </div>
  );
}
const EventForm = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row justify-center items-start lg:items-stretch p-6 space-y-4 lg:space-y-0 lg:space-x-2 min-h-screen">
      {/* Left Section */}
      <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">Mental Health First Aid (MHFA) Training (CPD Accredited)</h2>
          <div className="flex items-center text-gray-500 mt-2">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>Wed, Apr 16, 2025, 10:00 AM</span>
          </div>
          <div className="flex items-center mt-4">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">
              Draft <i className="fas fa-caret-down ml-1"></i>
            </button>
            <a href="#" className="text-blue-600">Preview <i className="fas fa-external-link-alt"></i></a>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Steps</h3>
        <ul>
          <li className="flex items-center mb-2"><i className="fas fa-check-circle text-blue-600 mr-2"></i>Build event page</li>
          <li className="flex items-center mb-2"><i className="far fa-circle text-gray-400 mr-2"></i>Online event page</li>
          <li className="flex items-center mb-2"><i className="far fa-dot-circle text-blue-600 mr-2"></i>Add tickets</li>
          <li className="flex items-center"><i className="far fa-circle text-gray-400 mr-2"></i>Publish</li>
        </ul>
      </aside>
      {/* Right Section */}
      <div className=" px-2 w-full lg:w-3/4">
        <div className="max-w-3xl mx-auto p-4">
          {/* Image Upload Section */}
          <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-6 max-w-[710px] min-h-[400px]">
            <img
              src="https://storage.googleapis.com/a1aa/image/oFssrRGOqYsjeanal5Ggc6TQow520FnOxiqapc7K5xs.jpg"
              alt="A busy event with people socializing in a large room"
              className="w-full h-[400px] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-75 p-6 rounded-lg text-center">
                <i className="fas fa-upload text-2xl text-blue-500 mb-2"></i>
                <p className="text-blue-500">Upload photos & video</p>
              </div>
            </div>
          </div>

          {/* Event Overview Section */}
          
          <EventOverview/>
          <Sections/>
          {/* Date and Location Section */}
          
          <DateLocation />
          {/* Overview Section */}
          
          <Overview/>
          {/* Save Button */}
          <div className="text-right">
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/addTicket")} >
              Save and continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
