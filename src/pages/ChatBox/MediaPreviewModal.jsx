import React from "react";
import { IoMdClose } from "react-icons/io";
const MediaPreviewModal = ({ isOpen, onClose, mediaUrl, contentType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh] w-full h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-0 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700"
        >
          <IoMdClose  />
        </button>
        {contentType === "IMAGE" && (
          <img
            src={mediaUrl}
            alt="preview"
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              console.error(`Failed to load preview image: ${mediaUrl}`);
              e.target.replaceWith(<span className="text-red-500">Hình ảnh không tải được</span>);
            }}
          />
        )}
        {contentType === "VIDEO" && (
          <video
            controls
            className="w-full h-full object-contain rounded-lg mt-2"
            autoPlay
          >
            <source src={mediaUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        )}
      </div>
    </div>
  );
};

export default MediaPreviewModal;