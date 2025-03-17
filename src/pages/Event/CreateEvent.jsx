import { div } from "framer-motion/client";
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
import SectionEvent from "./SectionEvent";
import UploadContainer from "./UploadImg";
import DatetimeLocation from "./EventDateLocate";
import OverviewSection from "./OverviewSection";
const Overview = () => {
  const [text, setText] = useState("");

  return (
    <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4 px-8">
      <h1 className="text-2xl font-bold mb-2">Overview</h1>
      <p className="text-gray-600 mb-4">
        Add more details about your event and include what people can expect if
        they attend.
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
const LocationForm = () => {
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
};
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
      </div>
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <button className="text-blue-600">+ Add slot</button>
      </div>
    </div>
  );
};
const UploadMedia = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideo(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg  border border-blue-500 max-w-[710px] w-full mb-4">
      <h1 className="text-2xl font-semibold mb-4">Add images and video</h1>

      {/* Image Upload Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Images</h2>
        <p className="text-sm text-gray-600 mb-4">
          <i className="fas fa-lightbulb text-blue-500"></i>
          <span className="font-semibold"> Pro tip: </span>
          Use photos that set the mood, and avoid distracting text overlays.
          <a className="text-blue-500" href="#">
            {" "}
            View examples <i className="fas fa-arrow-right"></i>
          </a>
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mb-2">
          {image ? (
            <img
              src={image}
              alt="Uploaded preview"
              className="mb-4 w-64 h-32 object-cover"
            />
          ) : (
            <img
              src="https://mybic.vn/uploads/news/default/no-image.png"
              alt="Placeholder"
              className="mb-4"
              width="100"
              height="100"
            />
          )}
          <p className="text-gray-600 mb-4">Drag and drop an image or</p>
          <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/jpeg, image/png"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <p className="text-sm text-gray-600">
          • Recommended image size: 2160 x 1080px • Maximum file size: 10MB •
          Supported image files: JPEG, PNG
        </p>
      </div>

      <hr className="my-6" />

      {/* Video Upload Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Video</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add a video to show your event’s vibe. The video will appear with your
          event images.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mb-2">
          {video ? (
            <video controls className="mb-4 w-64">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer">
            Upload Video
            <input
              type="file"
              accept="video/mp4, video/mov"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </label>
        </div>
        <p className="text-sm text-gray-600">
          • Min resolution: 480p • Ratio: any vertical • Length: up to 1 min •
          Format: MP4, MOV
        </p>
        <a className="text-blue-500" href="#">
          View more details <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};
const Agenda = () => {
  const [title, setTitle] = useState("ssss");
  const [startTime, setStartTime] = useState("2:30 AM");
  const [endTime, setEndTime] = useState("3:00 AM");
  const [description, setDescription] = useState("d");
  const [host, setHost] = useState("");
  const [desc, setDesc] = useState(false);
  const [artist, setArtist] = useState(false);
  return (
    <div className="bg-white p-8 rounded-lg  border border-blue-500 max-w-[710px] w-full mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Agenda</h2>
        <button className="text-red-500">Delete section</button>
      </div>

      <div className="border-b border-gray-200 mb-4"></div>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Start time
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 pl-10"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="far fa-clock text-gray-400"></i>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              End time
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 pl-10"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="far fa-clock text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col  ">
          {!desc ? (
            <button
              className="flex items-center text-gray-600 mt-2 text-[14px] mb-2"
              onClick={() => setDesc(true)}
            >
              <FaList className="mr-2" /> Add description
            </button>
          ) : (
            <div className="">
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
              <FaUser className="mr-2" /> Add Host or Artist
            </button>
          ) : (
            <div className=" ">
              <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                Artist
              </label>
              <input
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
        </div>
        <button className="w-full py-2 bg-gray-100 text-blue-600 rounded-md shadow-sm">
          + Add slot
        </button>
      </form>
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
        <LocationForm />
      </div>
    </div>
  );
};
const EventOverviewUp = () => {
  const [videoLink, setVideoLink] = useState("");

  return (
    <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4">
      <h1 className="text-2xl font-semibold mb-2">Overview</h1>
      <p className="text-gray-600 mb-4">
        Add more details about your event and include what people can expect if
        they attend.
      </p>

      <div className="border border-gray-300 rounded-lg mb-4">
        <div className="flex items-center justify-between border-b border-gray-300 p-2">
          <div className="flex items-center space-x-2">
            <button className="text-gray-600">Normal</button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-gray-600">B</button>
            <button className="text-gray-600">I</button>
            <button className="text-gray-600">U</button>
            <button className="text-gray-600">&#8226; List</button>
            <button className="text-gray-600">1. List</button>
          </div>
        </div>
        <textarea
          className="w-full p-4 h-32 border-none focus:outline-none"
          placeholder=""
        />
      </div>

      <button className="text-blue-600 flex items-center mb-4">
        ⚡ Suggest description
      </button>

      <div className="border border-red-500 rounded-lg mb-4 p-4">
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg mb-2">
          <span className="text-gray-400 text-4xl">🖼️</span>
          <p className="text-gray-400">Drag & drop or click to add image.</p>
          <p className="text-gray-400">JPEG, PNG, GIF, no larger than 10MB.</p>
        </div>
        <p className="text-red-500 text-sm mb-2">
          You must upload some image or delete this block
        </p>
        <div className="flex items-center border border-red-500 rounded-lg p-2">
          <input
            type="text"
            className="w-full border-none focus:outline-none"
            placeholder="Video link*"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <span className="text-red-500 ml-2">⚠️</span>
        </div>
        <p className="text-red-500 text-sm">Invalid Video link</p>
      </div>

      <div className="flex space-x-4">
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600">
          📝 Add text
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600">
          🖼️ Add image
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600">
          🎥 Add video
        </button>
      </div>
    </div>
  );
};
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
      <div className=" px-2 w-full lg:w-3/4 ">
        <div className="max-w-3xl mx-auto p-4 ">
          {/* Image Upload Section */}
          <UploadContainer />

          {/* Event Overview Section */}
          {!showOverview ? (
            <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4"
             onClick={() => setShowOverView(true)}>             
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
          <OverviewSection/>
          {/* {!showOverview ? (
            <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4"
             onClick={() => setShowOverView(true)}>             
                <h2 className="text-2xl font-semibold mb-2">Over View</h2>
                <span className="text-[14px] text-gray-600 mb-2">{summary}</span>
            </div>
          ) : (
            <Overview />
          )} */}
          
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
      </div>
    </div>
  );
};

export default EventForm;
