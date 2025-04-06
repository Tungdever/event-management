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
        console.warn("Invalid file type, skipping:", file);
        continue;
      }

      const formData = new FormData();
      formData.append("file", blob);

      const response = await fetch("http://localhost:8080/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await response.text();
      const publicId = result;
      if (!publicId) throw new Error("Invalid public_id in response: " + result);

      uploadedIds.push(publicId);
    } catch (error) {
      console.error("Error uploading file:", file, error);
      uploadedIds.push(null);
    }
  }

  return uploadedIds.filter((id) => id !== null);
};

const handleEdit = async (event) => {
  console.log("Editing event:", event);

  try {
    const isFile = (item) =>
      item instanceof File ||
      item instanceof Blob ||
      (typeof item === "string" && item.startsWith("blob:"));

    // Xử lý eventImages
    const existingImageIds =
      event.uploadedImages?.filter((item) => typeof item === "string" && item.startsWith("http")) || [];
    const newImages = event.uploadedImages?.filter(isFile) || [];
    const newImageIds = newImages.length > 0 ? await uploadFilesToCloudinary(newImages) : [];
    const eventImages = [...existingImageIds, ...newImageIds];

    // Xử lý mediaContent
    const existingMediaIds =
      event.overviewContent?.media
        ?.filter((item) => typeof item === "object" && item.url && item.url.startsWith("http"))
        .map((item) => item.url) || [];
    const newMedia = event.overviewContent?.media?.filter((item) =>
      isFile(item) || (typeof item === "object" && isFile(item.url))
    ) || [];
    const newMediaIds = newMedia.length > 0 ? await uploadFilesToCloudinary(newMedia) : [];
    const mediaContent = [...existingMediaIds, ...newMediaIds];

    // Xử lý tickets
    const ticketData = [];
    if (event.tickets?.length > 0) {
      for (const ticket of event.tickets) {
        ticketData.push({
          ticketId: ticket.ticketId || null, // Nếu không có ticketId thì để null
          ticketName: ticket.ticketName || "",
          ticketType: ticket.ticketType || "Paid",
          price: ticket.price || 0,
          quantity: ticket.quantity || 0,
          startTime: ticket.startTime || "", // Đảm bảo định dạng ISO
          endTime: ticket.endTime || "", // Đảm bảo định dạng ISO
        });
      }
    }

    // Xử lý segments
    const segmentData = [];
    if (event.segment?.length > 0) {
      for (const segment of event.segment) {
        const uploadedSpeakerImage = segment?.speaker?.speakerImage
          ? (await uploadFilesToCloudinary([segment.speaker.speakerImage]))[0]
          : segment.speaker?.speakerImage || null;

        segmentData.push({
          segmentId: segment.segmentId || null, // Nếu không có segmentId thì để null
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
            : "2025-04-05T12:10:00.000+00:00", // Giá trị mặc định nếu thiếu
          endTime: segment.endTime
            ? `${event.eventLocation.date}T${segment.endTime}:00`
            : "2025-04-05T17:06:00.000+00:00", // Giá trị mặc định nếu thiếu
        });
      }
    }

    // Tạo JSON payload theo cấu trúc yêu cầu
    const payload = {
      event: {
        eventId: event.eventId || null,
        eventName: event.eventName || "",
        eventDesc: event.eventDesc || "",
        eventType: event.eventType || "Conference",
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
        eventLocation:
          event.eventLocation.locationType === "online"
            ? "Online"
            : `${event.eventLocation.venueName || "-"} ${
                event.eventLocation.address || "-"
              } ${event.eventLocation.city || ""}`.trim(),
        tags: event.tags?.join("|") || "",
        eventVisibility: event.eventVisibility || "public",
        publishTime: event.publishTime || "now",
        refunds: event.refunds || "yes",
        validityDays: event.validityDays || 7,
        eventImages: eventImages,
        textContent: event.overviewContent?.text || "",
        mediaContent: mediaContent,
      },
      ticket: ticketData,
      segment: segmentData,
    };

    // Gửi request PUT đến API
    const response = await fetch("http://localhost:8080/api/events/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to edit event: ${errorText}`);
    }

    const result = await response.json();
    console.log("Event edited successfully:", result);
    alert("Event edited successfully!");

  } catch (error) {
    console.error("Failed to edit event:", error);
    alert(`Failed to edit event: ${error.message}`);
  }
};