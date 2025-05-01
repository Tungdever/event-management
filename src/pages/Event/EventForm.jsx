import React, { useState, useEffect } from "react";
import SectionEvent from "./SegmentEvent";
import UploadContainer from "./UploadImg";
import DatetimeLocation from "./EventDateLocate";
import OverviewSection from "./OverviewSection";
import Loader from "../../components/Loading";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import DOMPurify from 'dompurify'; 

const EventForm = ({ event, setEvent, onNext }) => {
  const [showOverview, setShowOverview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pasteError, setPasteError] = useState('');

  // Khởi tạo Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'underline text-blue-600',
        },
      }),
    ],
    content: event.eventDesc || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const plainText = editor.getText().replace(/\n/g, '');
      if (plainText.length <= 20000) {
        setEvent({ ...event, eventDesc: html });
        setPasteError('');
      } else {
        const truncatedText = plainText.slice(0, 20000);
        const newHtml = `<p>${truncatedText}</p>`;
        editor.commands.setContent(newHtml);
        setEvent({ ...event, eventDesc: newHtml });
        setPasteError('Nội dung dán đã vượt quá 20000 ký tự và được cắt bớt.');
      }
    },
    editorProps: {
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData.getData('text/plain');
        if (clipboardData) {
          const currentText = view.state.doc.textContent.replace(/\n/g, '');
          const newText = currentText + clipboardData.replace(/\n/g, '');
          if (newText.length > 20000) {
            const allowedText = clipboardData.slice(0, 20000 - currentText.length);
            view.dispatch(
              view.state.tr.insertText(allowedText, view.state.selection.from)
            );
            setPasteError('Nội dung dán đã vượt quá 20000 ký tự và được cắt bớt.');
            return true;
          }
        }
        return false;
      },
    },
  });

  // Đếm ký tự (loại bỏ thẻ HTML)
  const getCharacterCount = () => {
    const plainText = event.eventDesc.replace(/<[^>]+>/g, '').replace(/\n/g, '');
    return plainText.length;
  };

  // Kiểm tra xem eventName và eventDesc có hợp lệ không
  const isFormValid = () => {
    const hasEventName = event.eventName && event.eventName.trim() !== '';
    const hasEventDesc = event.eventDesc && event.eventDesc.replace(/<[^>]+>/g, '').trim() !== '';
    return hasEventName && hasEventDesc;
  };

  // Hàm cập nhật eventLocation
  const handleLocationUpdate = (updatedLocation) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      eventLocation: updatedLocation,
    }));
  };

  // Hàm cập nhật segment
  const handleSegmentUpdate = (updatedSegments) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      segment: updatedSegments,
    }));
  };

  // Hàm cập nhật overviewContent
  const handleContentUpdate = (newContent) => {
    setEvent((prev) => ({
      ...prev,
      overviewContent: newContent,
    }));
  };

  // Hàm cập nhật uploadedImages
  const handleImagesUpdate = (newImages) => {
    setEvent((prev) => ({
      ...prev,
      uploadedImages: newImages,
    }));
  };

  // Xử lý thay đổi cho các input khác (eventName)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý khi nhấn Complete
  const handleComplete = () => {
    if (isFormValid()) {
      setShowOverview(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Đồng bộ editor với event.eventDesc khi event thay đổi
  useEffect(() => {
    if (editor && event.eventDesc !== editor.getHTML()) {
      editor.commands.setContent(event.eventDesc || '');
    }
  }, [editor, event.eventDesc]);

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-3xl mx-auto p-4">
      {/* Image Upload Section */}
      <UploadContainer
        uploadedImages={event.uploadedImages || []}
        setUploadedImages={handleImagesUpdate}
      />

      {/* Event Overview Section */}
      {!showOverview ? (
        <div
          className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4"
          onClick={() => setShowOverview(true)}
        >
          <h2 className="text-5xl font-semibold mb-2">
            {event.eventName || "Untitled Event"}
          </h2>
          <div
            className="prose max-w-none text-gray-600"
            dangerouslySetInnerHTML={{
              __html: event.eventDesc
                ? DOMPurify.sanitize(event.eventDesc)
                : "No summary provided",
            }}
          />
        </div>
      ) : (
        <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4">
          <h1 className="text-2xl font-bold mb-6">Event Overview</h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 flex ">Event title <p className="text-red-500 ml-2">*</p></h2>
            <label className="block">
              <input
                type="text"
                name="eventName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
                value={event.eventName || ""}
                onChange={handleChange}
              />
              {!event.eventName?.trim() && (
                <p className="text-red-500 text-sm mt-1">Event title is required</p>
              )}
            </label>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 flex">Summary <p className="text-red-500 ml-2">*</p></h2>
            <label className="block">
              <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 mr-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-none'}`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 mr-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-none'}`}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`px-2 py-1 mr-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 ${editor?.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-none'}`}
                  >
                    Underline
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 mr-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 ${editor?.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-none'}`}
                  >
                    Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleLink({ href: prompt('Enter URL') }).run()}
                    className={`px-2 py-1 mr-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 ${editor?.isActive('link') ? 'bg-blue-600 text-white' : 'bg-none'}`}
                  >
                    Link
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className="p-2 min-h-[100px] border-none outline-none focus:ring-0"
                />
              </div>
              {(!event.eventDesc || event.eventDesc.replace(/<[^>]+>/g, '').trim() === '') && (
                <p className="text-red-500 text-sm mt-1">Summary is required</p>
              )}
            </label>
            <div className="text-right text-gray-600 mt-1">
              {getCharacterCount()} / 20000
            </div>
            {pasteError && (
              <div className="text-red-500 mt-1">{pasteError}</div>
            )}
          </div>

          <div className="text-blue-500 flex items-center">
            <button
              className={`mt-4 px-6 py-2 rounded-lg ${isFormValid() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={handleComplete}
              disabled={!isFormValid()}
            >
              Complete
            </button>
          </div>
        </div>
      )}

      <SectionEvent segmentData={event.segment} onSegmentUpdate={handleSegmentUpdate} />
      <DatetimeLocation
        locationData={event.eventLocation || {}}
        onLocationUpdate={handleLocationUpdate}
      />
      <OverviewSection
        content={event.overviewContent || { text: "", media: [] }}
        setContent={handleContentUpdate}
      />

      {/* Save Button */}
      <div className="text-right">
        <button
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
          onClick={onNext}
        >
          Save and continue
        </button>
      </div>

      {/* CSS tùy chỉnh cho ProseMirror */}
          <style>{`
      .ProseMirror {
        min-height: 100px !important;
        padding: 8px;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      .ProseMirror:focus {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
    `}</style>
    </div>
  );
};

export default EventForm;