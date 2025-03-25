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

const OverviewSection = ({ content, setContent }) => {
  const [showOverview, setShowOverview] = useState(false);
  

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
