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
  );
};

export default EventForm;
