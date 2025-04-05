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
      "speakerId": "1",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",
      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Confirmed",

    },
    {
      "speakerId": "2",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",

      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ]
      ,
      "speakerStatus": "Pending",

    },
    {
      "speakerId": "3",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "4",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "5",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",
    },
    {
      "speakerId": "6",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "7",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "8",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "8",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "9",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "10",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "11",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "12",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
    {
      "speakerId": "13",
      "speakerName": "Nguyễn Văn A",
      "speakerImage": "https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg",
      "speakerEmail": "nguyenvana@gmail.com",
      "speakerPhone": "0123456789",
      "speakerDesc": "Nguyễn Văn A là chuyên gia trong lĩnh vực AI và đã diễn thuyết tại nhiều hội nghị công nghệ lớn.",

      "speakerExperience": "10 năm kinh nghiệm trong ngành AI",
      "speakerSocialMedia": [
        "linkedin: https://linkedin.com/in/nguyenvana",
        "twitter: https://twitter.com/nguyenvana"
      ],
      "speakerStatus": "Rejected",

    },
  ]);
  const [newSpeaker, setNewSpeaker] = useState([
    {
      "speakerId": "",
      "speakerName": "",
      "speakerImage": "",
      "speakerImageFile": "",
      "speakerEmail": "",
      "speakerPhone": "",
      "speakerDesc": "",
      "speakerExperience": "",
      "speakerSocialMedia": "",
      "speakerStatus": "",
    },
  ]);
  // =====================================================================
  // Thống kê 
  const totalSpeakers = speakers.length;
  const confirmedSpeakers = speakers.filter(speaker => speaker.speakerStatus === "Confirmed").length;
  const pendingSpeakers = speakers.filter(speaker => speaker.speakerStatus === "Pending").length;
  const rejectedSpeakers = speakers.filter(speaker => speaker.speakerStatus === "Rejected").length;

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
    if (!speaker.speakerName?.trim()) newEmpty.speakerName = "Please fill in field.";
    if (!speaker.speakerEmail?.trim()) {
      newEmpty.speakerEmail = "Please fill in field.";
    } else if (!emailRegex.test(speaker.speakerEmail)) {
      newEmpty.speakerEmail = "Invalid email.";
    }

    if (!speaker.speakerPhone?.trim()) {
      newEmpty.speakerPhone = "Please fill in field.";
    }
    else if (!phoneRegex.test(speaker.speakerPhone)) {
      newEmpty.speakerPhone = "Invalid Phone.";
    }

    // if (!speaker.speakerSocialMedia?.trim()) {
    //   newEmpty.speakerSocialMedia = "Please fill in field.";
    // }
    // else if (!websiteRegex.test(speaker.speakerSocialMedia)) {
    //   newEmpty.speakerSocialMedia = "Invalid website.";
    // }
    if (!speaker.speakerDesc?.trim()) newEmpty.speakerDesc = "Please fill in field.";
    if (!speaker.speakerExperience?.trim()) newEmpty.speakerExperience = "Please fill in field.";

    if (!speaker.speaker_contract?.trim()) newEmpty.speaker_contract = "Please fill in field.";

  }

  // =====================================================================
  // Xử lý Thêm, Sửa, Xóa Speaker
  const addSpeakerHandle = async (e) => {
    e.preventDefault();
    // Check input
    let newEmpty = {};
    checkInput(newSpeaker, newEmpty);
    if (Object.keys(newEmpty).length > 0) {
      setEmpty(newEmpty);
      return;
    }
    const formData = new FormData();
    Object.entries(newSpeaker).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (key !== "speakerImage") {
          formData.append(key, value);
        }
      }
    });
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/myevent/${eid}/speaker`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload thành công:", response.data);
      setSpeakers((prevSpeakers) => [
        ...prevSpeakers,
        { ...newSpeaker, speakerId: String(prevSpeakers.length + 1) },
      ]);
      // Reset form
      setNewSpeaker({});
      setEmpty({});
      // Đóng modal
      document.querySelector("#add-speaker .btn-close").click();
    } catch (error) {
      console.error("Lỗi tải file:", error);
    }
  };
  const editSpeakerHandle = async (e) => {
    e.preventDefault();
    // Check input
    let newEmpty = {};
    checkInput(selectedSpeaker, newEmpty);
    if (Object.keys(newEmpty).length > 0) {
      setEmpty(newEmpty);
      console.log(newEmpty);
      return;
    }
    const formData = new FormData();
    Object.entries(selectedSponsor).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    });
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/myevent/${eid}/speaker`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload thành công:", response.data);
      setSpeakers((prevSpeakers) =>
        prevSpeakers.map((speaker) =>
          speaker.speakerId === selectedSpeaker.speakerId ? selectedSpeaker : speaker
        )
      );
      // Reset form
      setSelectedSpeaker({});
      setEmpty({});
      // Đóng modal
      document.querySelector("#edit-speaker .btn-close").click();
    } catch (error) {
      console.error("Lỗi tải file:", error);
    }
  };
  const handleDeleteSpeaker = (selectedSpeaker) => {
    const updatedSpeakers = speakers.filter(speaker => speaker.speakerId !== selectedSpeaker.speakerId);
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
      speaker.speakerName,
      speaker.speaker_level,
      speaker.speakerEmail,
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
      setSpeaker((prev) => ({ ...prev, speakerImageFile: file }))
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setSpeaker((prev) => ({ ...prev, speakerImage: reader.result }));
        };
      }
    };
    return (
      <div className="avatar-container">
        <div className="custom-avatar">
          <img src={speaker?.speakerImage || ""} alt="Speaker" />
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
            <a className="cancel-btn" onClick={() => setSpeaker((prev) => ({ ...prev, speakerImage: "" }))}>
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
                          setNewSpeaker({ ...newSpeaker, speakerName: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speakerName && <p className="text-red-500 text-sm">{empty.speakerName}</p>}
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speakerEmail: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speakerEmail && <p className="text-red-500 text-sm">{empty.speakerEmail}</p>}
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speakerPhone: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speakerPhone && <p className="text-red-500 text-sm">{empty.speakerPhone}</p>}
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
                              speakerSocialMedia: updatedSocialMedia
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
                          setNewSpeaker({ ...newSpeaker, speakerDesc: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speakerDesc && <p className="text-red-500 text-sm mb-1">{empty.speakerDesc}</p>}
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Experience<span className="required">*</span></label>
                        <input type="text" className="input-field" onChange={(e) =>
                          setNewSpeaker({ ...newSpeaker, speakerExperience: e.target.value })
                        } />
                      </div>
                    </div>
                    {empty.speakerExperience && <p className="text-red-500 text-sm ">{empty.speakerExperience}</p>}
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status<span className="required">*</span></label>
                        <select
                          className="input-field"
                          value={newSpeaker.speakerStatus}
                          onChange={(e) =>
                            setNewSpeaker({ ...newSpeaker, speakerStatus: e.target.value })
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
                        <input type="email" className="input-field" value={selectedSpeaker?.speakerName || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speakerName: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" value={selectedSpeaker?.speakerEmail || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speakerEmail: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speakerPhone || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speakerPhone: e.target.value })
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
                          value={selectedSpeaker?.speakerSocialMedia?.join("\n") || ""}
                          onChange={(e) => {
                            const updatedSocialMedia = e.target.value.split("\n"); // Chuyển từng dòng thành mảng
                            setSelectedSpeaker((prev) => ({
                              ...prev,
                              speakerSocialMedia: updatedSocialMedia
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
                        <input type="text" className="input-field" value={selectedSpeaker?.speakerDesc || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speakerDesc: e.target.value })
                        } />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Experience<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSpeaker?.speakerExperience || ""} onChange={(e) =>
                          setSelectedSpeaker({ ...selectedSpeaker, speakerExperience: e.target.value })
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
                          value={selectedSpeaker?.speakerStatus}
                          onChange={(e) =>
                            setSelectedSpeaker({ ...selectedSpeaker, speakerStatus: e.target.value })
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
                          <img src={selectedSpeaker.speakerImage} className="img-fluid" alt="img"></img>
                        </a>
                        <div>
                          <p className="custom-text mb-0">{selectedSpeaker.speakerName}</p>
                          <p>{selectedSpeaker.speakerEmail}</p>
                        </div>
                      </div>
                      <span className={`badge ${levelClass[selectedSpeaker.speakerStatus]?.class}`}>
                        <i className={levelClass[selectedSpeaker.speakerStatus]?.icon}></i>
                        {selectedSpeaker.speakerStatus}
                      </span>

                    </div>
                  </div>
                  <div className="p-3">
                    <p className="custom-text">Basic Info</p>
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <p className="fs-12 mb-0">Phone Number</p>
                          <p className="text-gray-9">{selectedSpeaker.speakerPhone}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <p className="fs-12 mb-0">Biography</p>
                          <p className="text-gray-9">{selectedSpeaker.speakerDesc}</p>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <p className="fs-12 mb-0">Experience</p>
                          <p className="text-gray-9">{selectedSpeaker.speakerExperience}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <p className="fs-12 mb-0">Social Media</p>
                          <p className="text-gray-9" style={{ whiteSpace: "pre-line" }}>
                            {selectedSpeaker.speakerSocialMedia.join("\n")}
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
                          src={speaker.speakerImage}
                          alt={speaker.speakerName}
                          className="img-fluid"
                          style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="ms-2">
                        <a href="#">
                          <h6>{speaker.speakerName}</h6>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>{speaker.speakerEmail}</td>
                  <td>{speaker.speakerPhone}</td>

                  <td>
                    <span
                      className={`badge bg-${speaker.speakerStatus === "Confirmed" ? "confirmed" : speaker.speakerStatus === "Pending" ? "pending" : "rejected"}`}
                    >
                      <i class="ti ti-point-filled me-1"></i>{speaker.speakerStatus}
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
