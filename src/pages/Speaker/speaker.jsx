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
  const [empty, setEmpty] = useState({});
  const dropdownExportRef = useRef(null);
  const dropdownLevelRef = useRef(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  // =====================================================================
  // Màu sắc và icon của từng status
  const levelClass = {
    Confirmed: { class: "bg-confirmed", icon: "ti ti-circle-check" },
    Pending: { class: "bg-pending", icon: "ti ti-clock-hour-4" },
    Rejected: { class: "bg-rejected", icon: "ti ti-circle-dashed-x" },
  };

  // =====================================================================
  // danh sách diễn giả
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
      
    },
    {
      "speaker_id": "4",
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
      
    },
    {
      "speaker_id": "5",
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
    },
    {
      "speaker_id": "6",
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
      
    },
    {
      "speaker_id": "7",
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
      
    },
    {
      "speaker_id": "8",
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
      
    },
    {
      "speaker_id": "8",
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
     
    },
    {
      "speaker_id": "9",
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
      
    },
    {
      "speaker_id": "10",
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
      
    },
    {
      "speaker_id": "11",
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
      
    },
    {
      "speaker_id": "12",
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
      
    },
    {
      "speaker_id": "13",
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
      
    },
  ]);
  const [newSpeaker, setNewSpeaker] = useState([
    {
      "speaker_id": "",
      "speaker_name": "",
      "speaker_photo": "",
      "speaker_email": "",
      "speaker_phone": "",
      "speaker_biography": "",
      "speaker_experience": "",
      "speaker_social_media": "",
      "speaker_contract": "",
      "speaker_status": "",

    },
  ]);
  // =====================================================================
  // Thống kê 
  const totalSpeakers = speakers.length;
  const confirmedSpeakers = speakers.filter(speaker => speaker.speaker_status === "Confirmed").length;
  const pendingSpeakers = speakers.filter(speaker => speaker.speaker_status === "Pending").length;
  const rejectedSpeakers = speakers.filter(speaker => speaker.speaker_status === "Rejected").length;

  // =====================================================================
  // Xử lý Dropdown (Export & Level)
  const toggleDropdownExport = () => {
    setIsOpenExport(!isOpenExport);
    setIsOpenLevel(false); // Đóng dropdown khác nếu đang mở
  };
  const toggleDropdownLevel = () => {
    setIsOpenLevel(!isOpenLevel);
    setIsOpenExport(false);
  };
  const handleLevel = (option) => {
    setSelectedLevel(option);
    setIsOpenLevel(false);
  };

  // =====================================================================
  // Kiểm tra dữ liệu nhập (Validation)
  const checkInput = (speaker, newEmpty) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[1-9][0-9]{8}|84[1-9][0-9]{8})$/;
    const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
    if (!speaker.speaker_name?.trim()) newEmpty.speaker_name = "Please fill in field.";
    if (!speaker.speaker_email?.trim()) {
      newEmpty.speaker_email = "Please fill in field.";
    } else if (!emailRegex.test(speaker.speaker_email)) {
      newEmpty.speaker_email = "Invalid email.";
    }

    if (!speaker.speaker_phone?.trim()) {
      newEmpty.speaker_phone = "Please fill in field.";
    }
    else if (!phoneRegex.test(speaker.speaker_phone)) {
      newEmpty.speaker_phone = "Invalid Phone.";
    }

    // if (!speaker.speaker_social_media?.trim()) {
    //   newEmpty.speaker_social_media = "Please fill in field.";
    // }
    // else if (!websiteRegex.test(speaker.speaker_social_media)) {
    //   newEmpty.speaker_social_media = "Invalid website.";
    // }
    if (!speaker.speaker_biography?.trim()) newEmpty.speaker_biography = "Please fill in field.";
    if (!speaker.speaker_experience?.trim()) newEmpty.speaker_experience = "Please fill in field.";
   
    if (!speaker.speaker_contract?.trim()) newEmpty.speaker_contract = "Please fill in field.";

  }

  // =====================================================================
  // Xử lý Thêm, Sửa, Xóa Speaker
  const addSpeakerHandle = (e) => {
    e.preventDefault();
    // Check input
    let newEmpty = {};
    checkInput(newSpeaker, newEmpty);
    if (Object.keys(newEmpty).length > 0) {
      setEmpty(newEmpty);
      return;
    }
    const updatedSpeakers = [
      ...speakers,
      { ...newSpeaker, speaker_id: String(speakers.length + 1) },
    ];
    setSpeakers(updatedSpeakers);

    // Reset form
    setNewSpeaker({
      speaker_id: "",
      speaker_name: "",
      speaker_photo: "",
      speaker_email: "",
      speaker_phone: "",
      speaker_biography: "",
      speaker_experience: "",
      speaker_social_media: "",
      speaker_contract: "",
      speaker_status: "",

    });
    setEmpty({});
    // Đóng modal
    document.querySelector("#add-speaker .btn-close").click();
  };
  const editSpeakerHandle = (e) => {
    console.log("1");
    e.preventDefault();
    // Check input
    let newEmpty = {};
    checkInput(selectedSpeaker, newEmpty);
    if (Object.keys(newEmpty).length > 0) {
      setEmpty(newEmpty);
      console.log("2");
      console.log(newEmpty);
      return;
    }
    console.log("3");
    setSpeakers((prevSpeakers) =>
      prevSpeakers.map((speaker) =>
        speaker.speaker_id === selectedSpeaker.speaker_id ? selectedSpeaker : speaker
      )
    );
    console.log("4");
    // Reset form
    setSelectedSpeaker({
      speaker_id: "",
      speaker_name: "",
      speaker_photo: "",
      speaker_email: "",
      speaker_phone: "",
      speaker_biography: "",
      speaker_experience: "",
      speaker_social_media: [],
      speaker_contract: "",
      speaker_status: "",

    });
    console.log("5");
    setEmpty({});
    // Đóng modal
    document.querySelector("#edit-speaker .btn-close").click();
    console.log("6");
  };
  const handleDeleteSpeaker = (selectedSpeaker) => {
    const updatedSpeakers = speakers.filter(speaker => speaker.speaker_id !== selectedSpeaker.speaker_id);
    setSpeakers(updatedSpeakers);
    setSelectedSpeaker(null);
  };
 
  // =====================================================================
  // Xử lý Phân trang
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

  // =====================================================================
  // Export dữ liệu (PDF, Excel)
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Times New Roman");
    doc.addFont('Times New Roman.ttf', 'Times New Roman', 'normal');
    doc.text("Speaker List", 14, 10);

    const tableColumn = ["Name", "Level", "Email", "Contract", "Phone", "Website"];
    const tableRows = speakers.map((speaker) => [
      speaker.speaker_name,
      speaker.speaker_level,
      speaker.speaker_email,
      speaker.speaker_contract,
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
  
  // =====================================================================
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

  // =====================================================================
  // Component Upload-Image
  const SpeakerUpload = ({ speaker, setSpeaker }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click(); // Kích hoạt input file
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setSpeaker((prev) => ({ ...prev, speaker_photo: reader.result }));
        };
      }
    };
    return (
      <div className="avatar-container">
        <div className="custom-avatar">
          <img src={speaker?.speaker_photo || ""} alt="Speaker" />
        </div>
        <div className="profile-upload">
          <div className="upload-title">Upload Speaker Image</div>
          <p className="upload-subtext">Image should be below 4 MB</p>
          <div className="upload-btn">
            <label onClick={handleButtonClick}>Upload</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <a className="cancel-btn" onClick={() => setSpeaker((prev) => ({ ...prev, speaker_photo: "" }))}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    );
  };
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
                    <SpeakerUpload speaker={newSpeaker} setSpeaker={setNewSpeaker} />
                  </div>

                  {/* Form input */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required">*</span></label>
                        <input type="email" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speaker_name: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speaker_name && <p className="text-red-500 text-sm">{empty.speaker_name}</p>}
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speaker_email: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speaker_email && <p className="text-red-500 text-sm">{empty.speaker_email}</p>}
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speaker_phone: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speaker_phone && <p className="text-red-500 text-sm">{empty.speaker_phone}</p>}
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Social Media</label>
                        <textarea
                          className="input-field"
                          onChange={(e) => {
                            const updatedSocialMedia = e.target.value.split("\n"); // Chuyển từng dòng thành mảng
                            setNewSpeaker((prev) => ({
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
                        <input type="text" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speaker_biography: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speaker_biography && <p className="text-red-500 text-sm mb-1">{empty.speaker_biography}</p>}
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Experience<span className="required">*</span></label>
                        <input type="text" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speaker_experience: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speaker_experience && <p className="text-red-500 text-sm ">{empty.speaker_experience}</p>}
                  </div>                 
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Contract<span className="required">*</span></label>
                        <input type="text" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speaker_contract: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speaker_contract && <p className="text-red-500 text-sm ">{empty.speaker_contract}</p>}
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status<span className="required">*</span></label>
                        <select
                          className="input-field"
                          value={newSpeaker.speaker_status}
                          onChange={(e) =>
                            setNewSpeaker({ ...newSpeaker, speaker_status: e.target.value })
                          }
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={addSpeakerHandle}>Add Speaker</button>
              </div>
            </form>
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
                    <SpeakerUpload speaker={selectedSpeaker} setSpeaker={setSelectedSpeaker} />
                  </div>

                  {/* Form input */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required">*</span></label>
                        <input type="email" className="input-field" value={selectedSpeaker?.speaker_name || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speaker_name: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" value={selectedSpeaker?.speaker_email || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speaker_email: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_phone || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speaker_phone: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Social Media</label>
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
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_biography || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speaker_biography: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Experience<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_experience || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speaker_experience: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>                
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Contract<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speaker_contract || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speaker_contract: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status<span className="required">*</span></label>
                        <select
                          className="input-field"
                          value={selectedSpeaker?.speaker_status}
                          onChange={(e) =>
                            setSelectedSpeaker({ ...selectedSpeaker, speaker_status: e.target.value })
                          }
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={editSpeakerHandle}>Save changes</button>
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
                          <img src={selectedSpeaker.speaker_photo} className="img-fluid" alt="img"></img>
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
                </>
              ) : (<p>No data available</p>)}
            </div>
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
                          src={speaker.speaker_photo}
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
