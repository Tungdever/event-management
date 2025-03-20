import React, { useState, useRef, useEffect } from "react";
import "./speaker.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../fonts/Times New Roman";
const Speaker = () => {

  const [selectedLevel, setSelectedLevel] = useState("Select level");
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);

  const dropdownExportRef = useRef(null);
  const dropdownLevelRef = useRef(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const levelClass = {
    Confirmed: { class: "bg-confirmed", icon: "ti ti-circle-check" },
    Pending: { class: "bg-pending", icon: "ti ti-clock-hour-4" },
    Rejected: { class: "bg-rejected", icon: "ti ti-circle-dashed-x" },
  };

  const [speakers, setSpeakers] = useState([
    {
      "speaker_id": "1",
      "speaker_name": "Nguyễn Văn A",
      "speaker_photo": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speaker_email": "nguyenvana@gmail.com",
      "speaker_phone": "0123456789",

      "speaker_biography": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speaker_experience": "10 năm kinh nghiệm trong ngành AI",
      "speaker_social_media": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speaker_status": "Confirmed",
      "speaker_presentation_date": "18/03/2025",
      "speaker_presentation_time": "10:00 AM - 11:30 AM",
      "speaker_presentation_materials": [
        "slides_ai_presentation.pdf",
        "ai_trends_2025.docx"
      ]
    },
    {
      "speaker_id": "2",
      "speaker_name": "Nguyễn Văn A",
      "speaker_photo": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speaker_email": "nguyenvana@gmail.com",
      "speaker_phone": "0123456789",

      "speaker_biography": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speaker_experience": "10 năm kinh nghiệm trong ngành AI",
      "speaker_social_media": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ]
      ,
      "speaker_status": "Pending",
      "speaker_presentation_date": "18/03/2025",
      "speaker_presentation_time": "10:00 AM - 11:30 AM",
      "speaker_presentation_materials": [
        "slides_ai_presentation.pdf",
        "ai_trends_2025.docx"
      ]
    },
    {
      "speaker_id": "3",
      "speaker_name": "Nguyễn Văn A",
      "speaker_photo": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speaker_email": "nguyenvana@gmail.com",
      "speaker_phone": "0123456789",
      "speaker_biography": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speaker_experience": "10 năm kinh nghiệm trong ngành AI",
      "speaker_social_media": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speaker_status": "Rejected",
      "speaker_presentation_date": "18/03/2025",
      "speaker_presentation_time": "10:00 AM - 11:30 AM",
      "speaker_presentation_materials": [
        "slides_ai_presentation.pdf",
        "ai_trends_2025.docx"
      ]
    },
    {
      "speaker_id": "1",
      "speaker_name": "Nguyễn Văn A",
      "speaker_photo": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speaker_email": "nguyenvana@gmail.com",
      "speaker_phone": "0123456789",

      "speaker_biography": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speaker_experience": "10 năm kinh nghiệm trong ngành AI",
      "speaker_social_media": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speaker_status": "Confirmed",
      "speaker_presentation_date": "18/03/2025",
      "speaker_presentation_time": "10:00 AM - 11:30 AM",
      "speaker_presentation_materials": [
        "slides_ai_presentation.pdf",
        "ai_trends_2025.docx"
      ]
    },
    {
      "speaker_id": "2",
      "speaker_name": "Nguyễn Văn A",
      "speaker_photo": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speaker_email": "nguyenvana@gmail.com",
      "speaker_phone": "0123456789",

      "speaker_biography": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speaker_experience": "10 năm kinh nghiệm trong ngành AI",
      "speaker_social_media": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ]
      ,
      "speaker_status": "Pending",
      "speaker_presentation_date": "18/03/2025",
      "speaker_presentation_time": "10:00 AM - 11:30 AM",
      "speaker_presentation_materials": [
        "slides_ai_presentation.pdf",
        "ai_trends_2025.docx"
      ]
    },
    {
      "speaker_id": "3",
      "speaker_name": "Nguyễn Văn A",
      "speaker_photo": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speaker_email": "nguyenvana@gmail.com",
      "speaker_phone": "0123456789",
      "speaker_biography": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speaker_experience": "10 năm kinh nghiệm trong ngành AI",
      "speaker_social_media": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speaker_status": "Rejected",
      "speaker_presentation_date": "18/03/2025",
      "speaker_presentation_time": "10:00 AM - 11:30 AM",
      "speaker_presentation_materials": [
        "slides_ai_presentation.pdf",
        "ai_trends_2025.docx"
      ]
    },

  ]);
  const totalSpeakers = speakers.length;
  const confirmedSpeakers = speakers.filter(speaker => speaker.speaker_status === "Confirmed").length;
  const pendingSpeakers = speakers.filter(speaker => speaker.speaker_status === "Pending").length;
  const rejectedSpeakers = speakers.filter(speaker => speaker.speaker_status === "Rejected").length;
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Times New Roman");
    doc.addFont('Times New Roman.ttf', 'Times New Roman', 'normal');
    doc.text("Speaker List", 14, 10);

    const tableColumn = ["Name", "Level", "Email", "Contact", "Phone", "Website"];
    const tableRows = speakers.map((speaker) => [
      speaker.speaker_name,
      speaker.speaker_level,
      speaker.speaker_email,
      speaker.speaker_contact,
      speaker.speaker_tel,
      speaker.speaker_website,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("speaker_list.pdf");
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(speakers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Speakers");

    // Xuất file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "speaker_list.xlsx");
  };


  const handleExport = (option) => {
    if (option === "Export as PDF") {
      exportToPDF();
    } else if (option === "Export as Excel") {
      exportToExcel();
    }
    setIsOpenExport(false);
  };
  const handleDeleteSpeaker = (selectedSpeaker) => {
    const updatedSpeakers = speakers.filter(speaker => speaker.speaker_id !== selectedSpeaker.speaker_id);
    setSpeakers(updatedSpeakers);
    setSelectedSpeaker(null);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(speakers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, speakers.length);
  const currentSpeakers = speakers.slice(startIndex, endIndex);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };
  // Xử lý mở/đóng dropdown Export
  const toggleDropdownExport = () => {
    setIsOpenExport(!isOpenExport);
    setIsOpenLevel(false); // Đóng dropdown khác nếu đang mở
  };

  // Xử lý mở/đóng dropdown Level
  const toggleDropdownLevel = () => {
    setIsOpenLevel(!isOpenLevel);
    setIsOpenExport(false); // Đóng dropdown khác nếu đang mở
  };

  // Xử lý chọn Export


  // Xử lý chọn Level
  const handleLevel = (option) => {
    setSelectedLevel(option);
    setIsOpenLevel(false);
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownExportRef.current &&
        !dropdownExportRef.current.contains(event.target)
      ) {
        setIsOpenExport(false);
      }
      if (
        dropdownLevelRef.current &&
        !dropdownLevelRef.current.contains(event.target)
      ) {
        setIsOpenLevel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="speaker-container">
      <div className="modal fade" id="add-speaker" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Speaker</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  {/* Avatar và upload */}
                  <div className="col-md-12">
                    <div className="avatar-container">
                      <div className="custom-avatar">
                        <img src="https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg" alt="img" />
                      </div>
                      <div className="profile-upload">
                        <div className="upload-title">Upload Speaker Image</div>
                        <p className="upload-subtext">Image should be below 4 MB</p>
                        <div className="upload-btn">
                          <label htmlFor="upload-image">Upload</label>
                          <input type="file" id="upload-image" />
                          <a className="cancel-btn">Cancel</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form input */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required">*</span></label>
                        <input type="email" className="input-field" />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Social Media<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Biography<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Experience<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Presentation Date<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Presentation Time<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Materials<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Contract<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Start Date<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">End Date<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Speaker</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="speaker-detail" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Speaker detail</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="moday-body">
              {selectedSpeaker ? (
                <>
                  <div className="p-3">
                    <div className="custom-body-header p-3">
                      <div className="file-name-icon">
                        <a href="#" className="custom-avatar-2">
                          <img src={selectedSpeaker.speaker_logo} className="img-fluid" alt="img"></img>
                        </a>
                        <div>
                          <p className="custom-text mb-0">{selectedSpeaker.speaker_name}</p>
                          <p>{selectedSpeaker.speaker_email}</p>
                        </div>
                      </div>
                      <span className={`badge ${levelClass[selectedSpeaker.speaker_status]?.class}`}>
                        <i className={levelClass[selectedSpeaker.speaker_status]?.icon}></i>
                        {selectedSpeaker.speaker_status}
                      </span>

                    </div>
                  </div>
                  <div className="p-3">
                    <p className="custom-text">Basic Info</p>
                    <div className="custom-content-1">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Phone Number</p>
                            <p className="text-gray-9">{selectedSpeaker.speaker_phone}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Biography</p>
                            <p className="text-gray-9">{selectedSpeaker.speaker_biography}</p>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Experience</p>
                            <p className="text-gray-9">{selectedSpeaker.speaker_experience}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Social Media</p>
                            <p className="text-gray-9" style={{ whiteSpace: "pre-line" }}>
                              {selectedSpeaker.speaker_social_media.join("\n")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="custom-text">Presentation detail</p>
                    <div>
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Date</p>
                            <p className="text-gray-9">{selectedSpeaker.speaker_presentation_date}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Time</p>
                            <p className="text-gray-9">{selectedSpeaker.speaker_presentation_time}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Materials</p>
                            <p className="text-gray-9" style={{ whiteSpace: "pre-line" }}>
                              {selectedSpeaker.speaker_presentation_materials.join("\n")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (<p>No data available</p>)}
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="edit-speaker" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Speaker</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  {/* Avatar và upload */}
                  <div className="col-md-12">
                    <div className="avatar-container">
                      <div className="custom-avatar">
                        <img src="https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg" alt="img" />
                      </div>
                      <div className="profile-upload">
                        <div className="upload-title">Upload Speaker Image</div>
                        <p className="upload-subtext">Image should be below 4 MB</p>
                        <div className="upload-btn">
                          <label htmlFor="upload-image">Upload</label>
                          <input type="file" id="upload-image" />
                          <a className="cancel-btn">Cancel</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form input */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required">*</span></label>
                        <input type="email" className="input-field" value={selectedSpeaker?.speaker_name || ""} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" value={selectedSpeaker?.speaker_email || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_phone || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Social Media<span className="required">*</span></label>
                        <textarea
                          className="input-field"
                          value={selectedSpeaker?.speaker_social_media?.join("\n") || ""}
                          onChange={(e) => {
                            const updatedSocialMedia = e.target.value.split("\n"); // Chuyển từng dòng thành mảng
                            setSelectedSpeaker((prev) => ({
                              ...prev,
                              speaker_social_media: updatedSocialMedia
                            }));
                          }}
                          style={{ whiteSpace: "pre-line", height: "60px", width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Biography<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_biography || ""} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Experience<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_experience || ""} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Presentation Date<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_presentation_date || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Presentation Time<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_presentation_time || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Materials<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_presentation_materials || ""} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="page-breadcrumb">
        <div my-auto mb-2>
          <h2 className="container-title">Speaker</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Speaker
              </li>
            </ol>
          </nav>
        </div>
        <div className="export-add-speaker">
          <div>
            <div className="custom-dropdown" ref={dropdownExportRef}>

              <button className="custom-dropdown-toggle" onClick={toggleDropdownExport}>
                <i className="ti ti-file-export me-1"></i> Export
              </button>
              {isOpenExport && (
                <ul className="custom-dropdown-menu">
                  {["Export as PDF", "Export as Excel"].map((option) => (
                    <li key={option} onClick={() => handleExport(option)}>
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
          <div className="mb-2">
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-speaker">
              <i className="ti ti-circle-plus me-2"></i> Add Speaker
            </a>
          </div>

        </div>

      </div>
      <div className="row">
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">

                <span className="card-avatar total">
                  <i class="ti ti-microphone-2"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Total speakers</p>
                  <h4 className="number">{totalSpeakers}</h4>
                </div>

              </div>

            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">
                <span className="card-avatar confirm">
                  <i class="ti ti-circle-check"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Confirmed</p>
                  <h4 className="number">{confirmedSpeakers}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">

              <div className="custom-card-content">

                <span className="card-avatar pending">
                  <i class="ti ti-clock-hour-4"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Pending</p>
                  <h4 className="number">{pendingSpeakers}</h4>
                </div>

              </div>

            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">

                <span className="card-avatar rejected">
                  <i class="ti ti-circle-dashed-x"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Rejected</p>
                  <div className="number">{rejectedSpeakers}</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>
            Speaker List
          </h5>

        </div>
        <div className="row table-length-filter">
          <div className="col-custom">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                Round Per page <select value={rowsPerPage} onChange={handleRowsPerPageChange} name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select form-select-sm">
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                Entries
              </label>
            </div>
          </div>
          <div className="col-custom">
            <div className="dataTables_filter">
              <label>
                <input type="search" className="form-control form-control-sm" placeholder="Search" aria-controls="DataTables_Table_0"></input>
              </label>
            </div>
          </div>
        </div>
        <div className="col-sm-12 table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>Speaker name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentSpeakers.map((speaker, index) => (
                <tr key={index}>
                  <td>
                    <div className="avt-name">
                      <div className="avatar">
                        <img
                          src={speaker.speaker_logo}
                          alt={speaker.speaker_name}
                          className="img-fluid"
                          style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="ms-2">
                        <a href="#">
                          <h6>{speaker.speaker_name}</h6>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>{speaker.speaker_email}</td>
                  <td>{speaker.speaker_phone}</td>

                  <td>
                    <span
                      className={`badge bg-${speaker.speaker_status === "Confirmed" ? "confirmed" : speaker.speaker_status === "Pending" ? "pending" : "rejected"}`}
                    >
                      <i class="ti ti-point-filled me-1"></i>{speaker.speaker_status}
                    </span>
                  </td>
                  <td>
                    <div className="table-action">
                      <button className="btn btn-detail" data-bs-toggle="modal" data-bs-target="#speaker-detail" onClick={() => setSelectedSpeaker(speaker)} >
                        <i className="ti ti-eye"></i>
                      </button>

                      <button className="btn btn-edit" data-bs-toggle="modal" data-bs-target="#edit-speaker" onClick={() => setSelectedSpeaker(speaker)}>
                        <i className="ti ti-pencil"></i>
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDeleteSpeaker(speaker)}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row table-info-paginate">
          <div className="col-custom">
            <div className="dataTables_info" id="DataTables_Table_0_info">
              Showing {startIndex + 1} - {endIndex} of {speakers.length} entries
            </div>
          </div>
          <div className="col-custom">
            <div className="dataTables_paginate paging_numbers" id="DataTables_Table_0_paginate">
              <ul className="pagination">
                <li className="paginate_button">
                  <button className="page-link"
                    onClick={handlePrevPage} disabled={currentPage === 1}>
                    <i className="ti ti-chevron-left" style={{ opacity: `${currentPage === 1 ? "0.5" : "1"}`, fontWeight: "600" }}></i>
                  </button>
                </li>
                <li className="paginate_button page-item active">
                  <a aria-controls="DataTables_Table_0" role="link" aria-current="page" data-dt-idx="0" tabindex="0" className="page-link">{currentPage}</a>
                </li>
                <li className="paginate_button">
                  <button className="page-link"
                    onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <i className="ti ti-chevron-right" style={{ opacity: `${currentPage === totalPages ? "0.5" : "1"}`, fontWeight: "600" }}></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speaker;
