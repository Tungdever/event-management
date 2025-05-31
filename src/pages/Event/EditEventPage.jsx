import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../components/Loading";

const EditEvent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const eventId = location.state?.eventId || undefined;
  const token = localStorage.getItem("token");
  const [selectedStep, setSelectedStep] = useState("build");
 
  const [event, setEvent] = useState({
    eventName: "",
    eventDesc: "",
    eventType: "",
    eventHost: "",
    eventStatus: "",
    eventStart: "",
    eventEnd: "",
    eventLocation: {
      date: "",
      startTime: "",
      endTime: "",
      locationType: "online",
      venueName: "",
      address: "",
      city: "",
    },
    tags: [],
    eventVisibility: "public",
    publishTime: new Date().toISOString(),
    refunds: "yes",
    validityDays: 7,
    uploadedImages: [],
    overviewContent: { text: "", media: [] },
    tickets: [],
    segment: [],
  });

  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
  }, [eventId]);

  const isReadOnly = event.eventStatus === "Complete";

  const fetchEventData = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/events/edit/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch event data: ${response.status} - ${errorText}`);
      }
      const data = await response.json();

      if (!data || !data.event) {
        throw new Error("Invalid event data received");
      }

      const transformedEvent = {
        eventName: data.event.eventName || "",
        eventDesc: data.event.eventDesc || "",
        eventType: String(data.event.eventTypeId || ""),
        eventHost: data.event.eventHost || "",
        eventStatus: data.event.eventStatus || "",
        eventStart: data.event.eventStart || "",
        eventEnd: data.event.eventEnd || "",
        eventLocation: {
          date: data.event.eventStart?.split("T")[0] || "",
          startTime: data.event.eventStart?.split("T")[1]?.slice(0, 5) || "",
          endTime: data.event.eventEnd?.split("T")[1]?.slice(0, 5) || "",
          locationType: data.event.eventLocation?.locationType || "venue",
          venueName: data.event.eventLocation?.venueName || "",
          venueSlug: data.event.eventLocation?.venueSlug || "",
          address: data.event.eventLocation?.address || "",
          city: data.event.eventLocation?.city || "",
        },
        tags: data.event.tags ? data.event.tags.split("|") : [],
        eventVisibility: data.event.eventVisibility || "public",
        publishTime: data.event.publishTime || new Date().toISOString(),
        refunds: data.event.refunds || "yes",
        validityDays: data.event.validityDays || 7,
        uploadedImages: data.event.eventImages || [],
        overviewContent: {
          text: data.event.textContent || "",
          media: data.event.mediaContent?.map((url) => ({ type: "image", url })) || [],
        },
        tickets: data.ticket?.map((ticket) => ({
          ticketId: ticket.ticketId || null,
          ticketName: ticket.ticketName || "",
          ticketType: ticket.ticketType || "",
          price: ticket.price || 0,
          quantity: ticket.quantity || 0,
          startTime: ticket.startTime || "",
          endTime: ticket.endTime || "",
          sold: ticket.sold || 0, // Thêm thuộc tính sold
        })) || [],
        segment: data.segment?.map((seg) => ({
          segmentId: seg.segmentId || null,
          segmentTitle: seg.segmentTitle || "",
          speaker: seg.speaker
            ? {
                speakerId: seg.speaker.speakerId || null,
                speakerImage: seg.speaker.speakerImage || "",
                speakerName: seg.speaker.speakerName || "",
                speakerDesc: seg.speaker.speakerDesc || "",
              }
            : null,
          segmentDesc: seg.segmentDesc || "",
          startTime: seg.startTime?.split("T")[1]?.slice(0, 5) || "",
          endTime: seg.endTime?.split("T")[1]?.slice(0, 5) || "",
        })) || [],
      };

      console.log("Fetched event data:", transformedEvent);
      setEvent(transformedEvent);
    } catch (error) {
      console.error("Error fetching event:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể tải dữ liệu sự kiện: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFilesToCloudinary = async (files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) return [];

    const uploadedIds = [];
    const fileList = Array.isArray(files)
      ? files.map((item) => (typeof item === "object" && item.url ? item.url : item))
      : [typeof files === "object" && files.url ? files.url : files];

    for (const file of fileList) {
      try {
        if (typeof file === "string" && file.startsWith("http")) {
          uploadedIds.push(file);
          continue;
        }

        let blob;
        if (typeof file === "string" && file.startsWith("blob:")) {
          const response = await fetch(file);
          if (!response.ok) throw new Error(`Failed to fetch blob: ${file}`);
          blob = await response.blob();
        } else if (file instanceof File || file instanceof Blob) {
          blob = file;
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Loại file không hợp lệ, bỏ qua!",
          });
          continue;
        }

        if (blob.size > 10 * 1024 * 1024) {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Kích thước ảnh vượt quá 10MB, bỏ qua!",
          });
          continue;
        }

        const formData = new FormData();
        formData.append("file", blob, "cropped_image.jpg");

        const response = await fetch("http://localhost:8080/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Tải lên thất bại: ${errorText}`);
        }

        const publicId = await response.text();
        if (!publicId) throw new Error("Không nhận được public_id");
        uploadedIds.push(publicId);
      } catch (error) {
        console.error("Lỗi tải lên:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể tải lên file: ${error.message}`,
        });
      }
    }

    return uploadedIds.filter((id) => id !== null);
  };

  const handleEdit = async (event) => {
    if (isReadOnly) {
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Sự kiện đã hoàn tất và chỉ có thể xem, không thể chỉnh sửa.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const isFile = (item) =>
        item instanceof File ||
        item instanceof Blob ||
        (typeof item === "string" && item.startsWith("blob:"));

      const existingImageIds =
        event.uploadedImages?.filter((item) => typeof item === "string" && item.startsWith("http")) || [];
      const newImages = event.uploadedImages?.filter(isFile) || [];
      const newImageIds = newImages.length > 0 ? await uploadFilesToCloudinary(newImages) : [];
      const eventImages = [...existingImageIds, ...newImageIds];

      const existingMediaIds =
        event.overviewContent?.media
          ?.filter((item) => typeof item === "object" && item.url && item.url.startsWith("http"))
          .map((item) => item.url) || [];
      const newMedia = event.overviewContent?.media?.filter((item) =>
        isFile(item) || (typeof item === "object" && isFile(item.url))
      ) || [];
      const newMediaIds = newMedia.length > 0 ? await uploadFilesToCloudinary(newMedia) : [];
      const mediaContent = [...existingMediaIds, ...newMediaIds];

      const ticketData = event.tickets?.length > 0
        ? event.tickets.map((ticket) => ({
            ticketId: ticket.ticketId || null,
            ticketName: ticket.ticketName || "",
            ticketType: ticket.ticketType || "Paid",
            price: ticket.price || 0,
            quantity: ticket.quantity || 0,
            startTime: ticket.startTime || "",
            endTime: ticket.endTime || "",
            sold: ticket.sold || 0, // Thêm sold vào payload
          }))
        : [];

      const segmentData = [];
      if (event.segment?.length > 0) {
        for (const segment of event.segment) {
          const uploadedSpeakerImage = segment?.speaker?.speakerImage
            ? (await uploadFilesToCloudinary([segment.speaker.speakerImage]))[0]
            : segment.speaker?.speakerImage || null;

          segmentData.push({
            segmentId: segment.segmentId || null,
            segmentTitle: segment.segmentTitle || "",
            speaker: segment.speaker
              ? {
                  speakerId: segment.speaker.speakerId || null,
                  speakerImage: uploadedSpeakerImage || "",
                  speakerName: segment.speaker.speakerName || "",
                  speakerEmail: segment.speaker.speakerEmail || null,
                  speakerTitle: segment.speaker.speakerTitle || null,
                  speakerPhone: segment.speaker.speakerPhone || null,
                  speakerAddress: segment.speaker.speakerAddress || null,
                  speakerDesc: segment.speaker.speakerDesc || "",
                }
              : null,
            eventID: event.eventId || null,
            segmentDesc: segment.segmentDesc || "",
            startTime: segment.startTime
              ? `${event.eventLocation.date}T${segment.startTime}:00`
              : "2025-04-05T12:10:00.000+00:00",
            endTime: segment.endTime
              ? `${event.eventLocation.date}T${segment.endTime}:00`
              : "2025-04-05T17:06:00.000+00:00",
          });
        }
      }

      const payload = {
        event: {
          eventId: eventId || null,
          eventName: event.eventName || "",
          eventDesc: event.eventDesc || "",
          eventTypeId: event.eventType || "",
          eventHost: event.eventHost || "OFFICE",
          eventStatus: event.eventStatus || "public",
          eventStart:
            event.eventLocation.date && event.eventLocation.startTime
              ? `${event.eventLocation.date}T${event.eventLocation.startTime}:00`
              : "2025-04-05T12:10:00",
          eventEnd:
            event.eventLocation.date && event.eventLocation.endTime
              ? `${event.eventLocation.date}T${event.eventLocation.endTime}:00`
              : "2025-04-05T14:06:00",
          eventLocation: {
            date: event.eventStart.split("T")[0],
            startTime: event.eventStart.split("T")[1]?.slice(0, 5),
            endTime: event.eventEnd.split("T")[1]?.slice(0, 5),
            locationType: event.eventLocation.locationType || "venue",
            venueName: event.eventLocation.venueName || "",
            venueSlug: event.eventLocation.venueSlug || "",
            address: event.eventLocation.address || "",
            city: event.eventLocation.city || "",
          },
          eventVisibility: event.eventVisibility || "public",
          publishTime: event.publishTime || new Date().toISOString(),
          refunds: event.refunds || "yes",
          validityDays: event.validityDays || 7,
          eventImages: eventImages,
          textContent: event.overviewContent?.text || "",
          mediaContent: mediaContent,
          tags: event.tags?.join("|") || "",
        },
        ticket: ticketData,
        segment: segmentData,
      };

      console.log("Submitting payload:", payload);

      const response = await fetch("http://localhost:8080/api/events/edit", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to edit event: ${errorText}`);
      }

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Sự kiện đã được chỉnh sửa thành công!",
      });
    } catch (error) {
      console.error("Edit error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể chỉnh sửa sự kiện: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketsUpdate = (updatedTickets) => {
    if (isReadOnly) return;
    setEvent((prevEvent) => ({
      ...prevEvent,
      tickets: updatedTickets,
    }));
  };

  const renderStepComponent = () => {
    switch (selectedStep) {
      case "build":
        return (
          <EventForm
            event={event}
            setEvent={setEvent}
            onNext={() => setSelectedStep("tickets")}
            isReadOnly={isReadOnly}
          />
        );
      case "tickets":
        return (
          <AddTicket
            ticketData={event.tickets}
            onTicketsUpdate={handleTicketsUpdate}
            onNext={() => setSelectedStep("publish")}
            isReadOnly={isReadOnly}
            eventStart={event.eventStart} // Truyền eventStart
            eventEnd={event.eventEnd}     // Truyền eventEnd
          />
        );
      case "publish":
        return (
          <EventPublishing
            event={event}
            setEvent={setEvent}
            onPublish={() => handleEdit(event)}
            isReadOnly={isReadOnly}
          />
        );
      default:
        return <EventForm event={event} setEvent={setEvent} />;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-center min-h-screen p-6 space-y-4 bg-gray-50 lg:flex-row lg:items-stretch lg:space-y-0 lg:space-x-2">
          <aside className="w-full p-4 bg-white shadow-sm lg:w-1/4">
            <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">
                {event.eventName || "Untitled Event"}
              </h2>
              <div className="flex items-center mt-2 text-gray-500">
                <i className="mr-2 far fa-calendar-alt"></i>
                <span>
                  {event.eventLocation.date && event.eventLocation.startTime
                    ? `${event.eventLocation.date}, ${event.eventLocation.startTime}`
                    : "Date and time not set"}
                </span>
              </div>
              {isReadOnly && (
                <p className="mt-2 text-red-500">
                  Sự kiện đã hoàn tất, chỉ có thể xem.
                </p>
              )}
            </div>
            <h3 className="mb-2 text-lg font-semibold">Steps</h3>
            <div className="space-y-2">
              {["build", "tickets", "publish"].map((step) => (
                <label
                  key={step}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="eventStep"
                    value={step}
                    checked={selectedStep === step}
                    onChange={() => setSelectedStep(step)}
                    className="w-4 h-4 border-2 border-orange-500 accent-red-500"
                  />
                  <span>
                    {step === "build" && "Build event page"}
                    {step === "tickets" && "Add tickets"}
                    {step === "publish" && "Publish"}
                  </span>
                </label>
              ))}
            </div>
          </aside>
          <div className="w-full px-2 lg:w-3/4">{renderStepComponent()}</div>
        </div>
      )}
    </>
  );
};

export default EditEvent;