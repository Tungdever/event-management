import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "./sponsor.css";
import * as XLSX from 'xlsx';
import { pdf } from '@react-pdf/renderer';
import "../../fonts/Times New Roman";
import axios from "axios";
import { useParams } from "react-router-dom";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SponsorPDFDocument from './SponsorPDFDocument';
import { toast } from 'react-toastify';

const Sponsor = () => {
  const { eventId } = useParams();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [empty, setEmpty] = useState({});
  const dropdownExportRef = useRef(null);
  const dropdownLevelRef = useRef(null);
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);
  const [existingSponsors, setExistingSponsors] = useState([]);

  useEffect(() => {
    if (toastMessage && toastType) {
      if (toastType === "info") {
        toast.info(toastMessage);
      }
      else if (toastType === "success") {
        toast.success(toastMessage);
      }
      else if (toastType === "error") {
        toast.error(toastMessage);
      }
      else if (toastType === "warn") {
        toast.warn(toastMessage);
      }
      setToastType(null)
      setToastMessage(null);
    }
  }, [toastMessage]);

  // Màu sắc và icon của từng Level
  const levelClass = {
    Diamond: { class: "badge-diamond", icon: "ti ti-diamond" },
    Gold: { class: "badge-gold", icon: "ti ti-coins" },
    Silver: { class: "badge-silver", icon: "ti ti-coins" },
  };

  // Danh sách sponsor
  const [sponsors, setSponsors] = useState([]);
  const filteredSponsors = sponsors.filter((sponsor) => {
    const matchesSearch =
      sponsor.sponsorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.sponsorEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === "" || sponsor.sponsorLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });
  const [newSponsor, setNewSponsor] = useState({
    sponsorId: "",
    sponsorName: "",
    sponsorLogoFile: "",
    sponsorLogo: "",
    sponsorEmail: "",
    sponsorAddress: "",
    sponsorLevel: "",
    sponsorRepresentativeName: "",
    sponsorRepresentativePosition: "",
    sponsorRepresentativeEmail: "",
    sponsorRepresentativePhone: "",
    sponsorPhone: "",
    sponsorWebsite: "",
    sponsorType: "",
    sponsorStatus: "",
    sponsorStartDate: "",
    sponsorEndDate: "",
  });
  const fetchSponsors = async () => {
    axios
      .get(`http://localhost:8080/api/v1/myevent/${eventId}/sponsor`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setSponsors(response.data.data);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Can't get the list of sponsors!";
        setToastMessage(errorMessage);
        setToastType("error");
      });
  };
  const fetchExistingSponsors = async () => {
    let userId;
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        userId = decodedPayload.userId;
      } catch (e) {
        return;
      }
    } else {
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/${userId}/sponsor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingSponsors(response.data.data || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch existing sponsors!';
      setToastMessage(errorMessage);
      setToastType('error');
    }
  };
  useEffect(() => {
    fetchSponsors();
    fetchExistingSponsors();
  }, []);


  // Thống kê số lượng nhà tài trợ
  const totalSponsors = sponsors.length;
  const diamondSponsors = Array.isArray(sponsors) ? sponsors.filter(sponsor => sponsor.sponsorLevel === "Diamond").length : 0;
  const goldSponsors = Array.isArray(sponsors) ? sponsors.filter(sponsor => sponsor.sponsorLevel === "Gold").length : 0;
  const silverSponsors = Array.isArray(sponsors) ? sponsors.filter(sponsor => sponsor.sponsorLevel === "Silver").length : 0;

  // Xử lý Dropdown (Export & Level)
  const toggleDropdownExport = () => {
    setIsOpenExport(!isOpenExport);
    setIsOpenLevel(false);
  };
  const toggleDropdownLevel = () => {
    setIsOpenLevel(!isOpenLevel);
    setIsOpenExport(false);
  };
  const handleLevel = (option) => {
    setSelectedLevel(option === "All Levels" ? "" : option);
    setIsOpenLevel(false);
  };

  // Kiểm tra dữ liệu nhập (Validation)
  const checkInput = (sponsor, newEmpty) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[1-9][0-9]{8}|84[1-9][0-9]{8})$/;
    const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;

    if (!sponsor.sponsorName?.trim()) newEmpty.sponsorName = "Please fill in field.";
    if (!sponsor.sponsorEmail?.trim()) {
      newEmpty.sponsorEmail = "Please fill in field.";
    } else if (!emailRegex.test(sponsor.sponsorEmail)) {
      newEmpty.sponsorEmail = "Invalid email.";
    }
    if (!sponsor.sponsorRepresentativeName?.trim()) newEmpty.sponsorRepresentativeName = "Please fill in field.";
    if (!sponsor.sponsorRepresentativeEmail?.trim()) {
      newEmpty.sponsorRepresentativeEmail = "Please fill in field.";
    } else if (!emailRegex.test(sponsor.sponsorRepresentativeEmail)) {
      newEmpty.sponsorRepresentativeEmail = "Invalid email.";
    }
    if (!sponsor.sponsorRepresentativePhone?.trim()) {
      newEmpty.sponsorRepresentativePhone = "Please fill in field.";
    } else if (!phoneRegex.test(sponsor.sponsorRepresentativePhone)) {
      newEmpty.sponsorRepresentativePhone = "Invalid Phone.";
    }
    if (!sponsor.sponsorRepresentativePosition?.trim()) newEmpty.sponsorRepresentativePosition = "Please fill in field.";
    if (!sponsor.sponsorAddress?.trim()) newEmpty.sponsorAddress = "Please fill in field.";
    if (!sponsor.sponsorPhone?.trim()) {
      newEmpty.sponsorPhone = "Please fill in field.";
    } else if (!phoneRegex.test(sponsor.sponsorPhone)) {
      newEmpty.sponsorPhone = "Invalid Phone.";
    }
    if (!sponsor.sponsorWebsite?.trim()) {
      newEmpty.sponsorWebsite = "Please fill in field.";
    } else if (!websiteRegex.test(sponsor.sponsorWebsite)) {
      newEmpty.sponsorWebsite = "Invalid website.";
    }
  };

  // Xử lý Thêm, Sửa, Xóa Sponsor
  const addSponsorHandle = async (e) => {
    e.preventDefault();
    let newEmpty = {};
    checkInput(newSponsor, newEmpty);
    if (Object.keys(newEmpty).length > 0) {
      setEmpty(newEmpty);
      return;
    }
    const formData = new FormData();
    Object.entries(newSponsor).forEach(([key, value]) => {
      if (value || key === "sponsorId") { // Luôn gửi sponsorId, kể cả khi rỗng
        if (value instanceof File) {
          formData.append(key, value);
        } else if (key !== "sponsorLogo") {
          // Chuyển sponsorId thành chuỗi số nguyên nếu cần
          formData.append(key, key === "sponsorId" ? String(value) : value);
        }
      }
    });
    console.log(formData);
    try {
      let response;
      // Kiểm tra xem sponsorId có tồn tại và không rỗng
      if (typeof newSponsor.sponsorId === 'string' && newSponsor.sponsorId.trim() !== "") {
        // Gọi API PUT để cập nhật nhà tài trợ hiện có
        response = await axios.put(
          `http://localhost:8080/api/v1/myevent/${eventId}/sponsor/${newSponsor.sponsorId}`, // Thêm sponsorId vào URL
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Gọi API POST để tạo mới nhà tài trợ
        response = await axios.post(
          `http://localhost:8080/api/v1/myevent/${eventId}/sponsor`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Thành công:", response.data);
      if (response.data.statusCode === "1" || response.data.statusCode === 1) {
        setToastMessage(response.data.msg);
        setToastType("success");

        // Cập nhật danh sách sponsors
        setSponsors((prevSponsors) => {
          if (newSponsor.sponsorId && newSponsor.sponsorId.trim() !== "") {
            // Cập nhật nhà tài trợ hiện có
            return prevSponsors.map((s) =>
              s.sponsorId === newSponsor.sponsorId ? { ...newSponsor } : s
            );
          } else {
            // Thêm nhà tài trợ mới
            return [
              ...prevSponsors,
              { ...newSponsor, sponsorId: String(prevSponsors.length + 1) },
            ];
          }
        });

        // Reset form
        setNewSponsor({
          sponsorId: "",
          sponsorName: "",
          sponsorLogoFile: "",
          sponsorLogo: "",
          sponsorEmail: "",
          sponsorAddress: "",
          sponsorLevel: "",
          sponsorRepresentativeName: "",
          sponsorRepresentativePosition: "",
          sponsorRepresentativeEmail: "",
          sponsorRepresentativePhone: "",
          sponsorPhone: "",
          sponsorWebsite: "",
          sponsorType: "",
          sponsorStatus: "",
          sponsorStartDate: "",
          sponsorEndDate: "",
        });
        setEmpty({});
        document.querySelector("#add-sponsor .btn-close").click();
      } else {
        setToastMessage(response.data.msg);
        setToastType("error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Can't process sponsor!";
      setToastMessage(errorMessage);
      setToastType("error");
    }
  };

  const addExistingSponsor = (sponsor) => {
    // Update newSponsor state with selected sponsor's details
    setNewSponsor({
      sponsorId: String(sponsor.sponsorId ?? ""),
      sponsorName: sponsor.sponsorName || "",
      sponsorLogoFile: "",
      sponsorLogo: sponsor.sponsorLogo || "",
      sponsorEmail: sponsor.sponsorEmail || "",
      sponsorAddress: sponsor.sponsorAddress || "",
      sponsorLevel: sponsor.sponsorLevel || "",
      sponsorRepresentativeName: sponsor.sponsorRepresentativeName || "",
      sponsorRepresentativePosition: sponsor.sponsorRepresentativePosition || "",
      sponsorRepresentativeEmail: sponsor.sponsorRepresentativeEmail || "",
      sponsorRepresentativePhone: sponsor.sponsorRepresentativePhone || "",
      sponsorPhone: sponsor.sponsorPhone || "",
      sponsorWebsite: sponsor.sponsorWebsite || "",
      sponsorType: sponsor.sponsorType || "",
      sponsorStatus: sponsor.sponsorStatus || "",
      sponsorStartDate: sponsor.sponsorStartDate || "",
      sponsorEndDate: sponsor.sponsorEndDate || "",
    });

    // Close existing-sponsors modal
    document.querySelector('#existing-sponsors .btn-close').click();

    // Open add-sponsor modal
    const addSponsorModalElement = document.getElementById('add-sponsor');
    if (window.bootstrap && window.bootstrap.Modal) {
      const addSponsorModal = new window.bootstrap.Modal(addSponsorModalElement);
      addSponsorModal.show();
    } else {
      console.warn('Bootstrap Modal is not available. Falling back to DOM trigger.');
      // Fallback: Simulate click on a hidden button with data-bs-toggle
      const triggerButton = document.createElement('button');
      triggerButton.setAttribute('data-bs-toggle', 'modal');
      triggerButton.setAttribute('data-bs-target', '#add-sponsor');
      triggerButton.style.display = 'none';
      document.body.appendChild(triggerButton);
      triggerButton.click();
      document.body.removeChild(triggerButton);
    }
  };

  const editSponsorHandle = async (e) => {
    e.preventDefault();
    let newEmpty = {};
    checkInput(selectedSponsor, newEmpty);
    if (Object.keys(newEmpty).length > 0) {
      setEmpty(newEmpty);
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
        `http://localhost:8080/api/v1/myevent/${eventId}/sponsor/${selectedSponsor.sponsorId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.statusCode === "1" || response.data.statusCode === 1) {
        setToastMessage(response.data.msg);
        setToastType("success");
        setSponsors((prevSponsors) =>
          prevSponsors.map((sponsor) =>
            sponsor.sponsorId === selectedSponsor.sponsorId ? selectedSponsor : sponsor
          )
        );
        setSelectedSponsor(null);
        setEmpty({});
        document.querySelector("#edit-sponsor .btn-close").click();
      } else {
        setToastMessage(response.data.msg);
        setToastType("error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Can't get the list of sponsors!";
      setToastMessage(errorMessage);
      setToastType("error");
    }
  };

  const handleDeleteSponsor = async (selectedSponsor) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/myevent/${eventId}/sponsor/${selectedSponsor.sponsorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.statusCode === "1" || response.data.statusCode === 1) {
        setToastMessage(response.data.msg);
        setToastType("success");
      } else {
        setToastType("error");
        setToastMessage(response.data.msg);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Can't get the list of sponsors!";
      setToastType("error");
      setToastMessage(errorMessage);
    }
    const updatedSponsors = sponsors.filter(sponsor => sponsor.sponsorId !== selectedSponsor.sponsorId);
    setSponsors(updatedSponsors);
    setSelectedSponsor(null);
  };

  // Xử lý Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredSponsors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredSponsors.length);
  const currentSponsors = filteredSponsors.slice(startIndex, endIndex);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // Export dữ liệu (PDF, Excel)
  const exportToPDF = async () => {
    const blob = await pdf(<SponsorPDFDocument sponsors={sponsors} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sponsors.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sponsors');

    worksheet.columns = [
      { header: 'ID', key: 'sponsorId', width: 10 },
      { header: 'Name', key: 'sponsorName', width: 20 },
      { header: 'Email', key: 'sponsorEmail', width: 30 },
      { header: 'Phone', key: 'sponsorPhone', width: 15 },
      { header: 'Website', key: 'sponsorWebsite', width: 30 },
      { header: 'Address', key: 'sponsorAddress', width: 30 },
      { header: 'Level', key: 'sponsorLevel', width: 20 },
      { header: 'Representative Name', key: 'sponsorRepresentativeName', width: 30 },
      { header: 'Representative Position', key: 'sponsorRepresentativePosition', width: 20 },
      { header: 'Sponsor Type', key: 'sponsorType', width: 15 },
      { header: 'Amount', key: 'sponsorAmount', width: 20 },
      { header: 'Contribution', key: 'sponsorContribution', width: 20 },
      { header: 'Status', key: 'sponsorStatus', width: 15 },
      { header: 'Start Date', key: 'sponsorStartDate', width: 20 },
      { header: 'End Date', key: 'sponsorEndDate', width: 20 },
    ];

    sponsors.forEach(s => {
      worksheet.addRow(s);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'sponsors.xlsx');
  };
  const handleExport = (option) => {
    if (option === "Export as PDF") {
      exportToPDF();
    } else if (option === "Export as Excel") {
      exportToExcel();
    }
    setIsOpenExport(false);
  };

  // Xử lí import
  const fileInputRef = useRef();
  const handleImport = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet);
        console.log("Raw data:", rawData);

        const sponsorsFile = rawData.map((item) => ({
          sponsorId: item["ID"],
          sponsorName: item["Name"],
          sponsorEmail: item["Email"],
          sponsorPhone: item["Phone"],
          sponsorWebsite: item["Website"],
          sponsorAddress: item["Address"],
          sponsorLevel: item["Level"],
          sponsorRepresentativeName: item["Representative Name"],
          sponsorRepresentativePosition: item["Representative Position"],
          sponsorType: item["Sponsor Type"],
          sponsorAmount: item["Amount"],
          sponsorContribution: item["Contribution"],
          sponsorStatus: item["Status"],
          sponsorStartDate: item["Start Date"],
          sponsorEndDate: item["End Date"],
        }));

        const response = await axios.post(
          `http://localhost:8080/api/v1/myevent/${eventId}/sponsors/import`,
          sponsorsFile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.statusCode === 1 || response.data.statusCode === "1") {
          setToastMessage(response.data.msg);
          setToastType("success");
          fetchSponsors();
        } else {
          setToastMessage(response.data.msg);
          setToastType("error");
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || "Can't add sponsor to event!";
        setToastMessage(errorMessage);
        setToastType("error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Xử lí khi click outside dropdown
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

  // Component Upload-Image
  const SponsorUpload = ({ sponsor, setSponsor }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      console.log("File chọn:", file);
      setSponsor((prev) => ({ ...prev, sponsorLogoFile: file }));
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setSponsor((prev) => ({ ...prev, sponsorLogo: reader.result }));
        };
      }
    };
    return (
      <div className="avatar-container">
        <div className="custom-avatar">
          <img src={sponsor?.sponsorLogo || ""} alt="Sponsor" />
        </div>
        <div className="profile-upload">
          <div className="upload-title">Upload Sponsor Image</div>
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
            <a className="cancel-btn" onClick={() => setSponsor((prev) => ({ ...prev, sponsorLogo: "" }))}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sponsor-container">
      <div className="modal fade" id="add-sponsor" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Sponsor</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <SponsorUpload sponsor={newSponsor} setSponsor={setNewSponsor} />
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorName}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorName: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorName && <p className="text-red-500 text-sm">{empty.sponsorName}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input
                          type="email"
                          className="input-field"
                          value={newSponsor.sponsorEmail}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorEmail: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorEmail && <p className="text-red-500 text-sm">{empty.sponsorEmail}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Address <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorAddress}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorAddress: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorAddress && <p className="text-red-500 text-sm">{empty.sponsorAddress}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorPhone}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorPhone: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorPhone && <p className="text-red-500 text-sm">{empty.sponsorPhone}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Website <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorWebsite}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorWebsite: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorWebsite && <p className="text-red-500 text-sm">{empty.sponsorWebsite}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Name <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorRepresentativeName}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorRepresentativeName: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativeName && <p className="text-red-500 text-sm">{empty.sponsorRepresentativeName}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Position <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorRepresentativePosition}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorRepresentativePosition: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativePosition && <p className="text-red-500 text-sm">{empty.sponsorRepresentativePosition}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Email <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorRepresentativeEmail}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorRepresentativeEmail: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativeEmail && <p className="text-red-500 text-sm">{empty.sponsorRepresentativeEmail}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Phone <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={newSponsor.sponsorRepresentativePhone}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorRepresentativePhone: e.target.value })
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativePhone && <p className="text-red-500 text-sm">{empty.sponsorRepresentativePhone}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Type <span className="required">*</span></label>
                        <select
                          className="input-select"
                          value={newSponsor.sponsorType}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorType: e.target.value })
                          }
                        >
                          <option value="">-- Select Type --</option>
                          <option value="Financialive">Financial Sponsorship</option>
                          <option value="In-kind">In-kind Sponsorship</option>
                          <option value="Media">Media Sponsorship</option>
                          <option value="Promotional">Promotional Partners</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Level <span className="required">*</span></label>
                        <select
                          className="input-select"
                          value={newSponsor.sponsorLevel}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorLevel: e.target.value })
                          }
                        >
                          <option value="">-- Select Level --</option>
                          <option value="Diamond">Diamond</option>
                          <option value="Gold">Gold</option>
                          <option value="Silver">Silver</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status <span className="required">*</span></label>
                        <select
                          className="input-select"
                          value={newSponsor.sponsorStatus}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorStatus: e.target.value })
                          }
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Start Date <span className="required">*</span></label>
                        <input
                          type="date"
                          className="input-field"
                          value={newSponsor.sponsorStartDate}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorStartDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">End Date <span className="required">*</span></label>
                        <input
                          type="date"
                          className="input-field"
                          value={newSponsor.sponsorEndDate}
                          onChange={(e) =>
                            setNewSponsor({ ...newSponsor, sponsorEndDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={addSponsorHandle}>
                  Add Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="existing-sponsors" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Select Existing Sponsor</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Sponsor Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Website</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(existingSponsors) && existingSponsors.length > 0 ? (
                      existingSponsors.map((sponsor, index) => {
                        const isAdded = sponsors.some((s) => s.sponsorId === sponsor.sponsorId);
                        return (
                          <tr key={index} style={{ opacity: isAdded ? 0.6 : 1 }}>
                            <td>{sponsor.sponsorName}</td>
                            <td>{sponsor.sponsorEmail}</td>
                            <td>{sponsor.sponsorPhone}</td>
                            <td>{sponsor.sponsorWebsite}</td>
                            <td>{sponsor.sponsorAddress}</td>
                            <td>
                              {isAdded ? (
                                <span className="badge bg-success">Already Added</span>
                              ) : (
                                <span className="badge bg-secondary">Not Added</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => addExistingSponsor(sponsor)}
                                disabled={isAdded}
                              >
                                Add to Event
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No existing sponsors found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-sponsor"
                onClick={() => document.querySelector('#existing-sponsors .btn-close').click()}
              >
                Create New Sponsor
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="sponsor-detail" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sponsor detail</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedSponsor ? (
                <>
                  <div className="p-3">
                    <div className="custom-body-header p-3">
                      <div className="file-name-icon">
                        <a href="#" className="custom-avatar-2">
                          <img src={selectedSponsor.sponsorLogo} className="img-fluid" alt="img"></img>
                        </a>
                        <div>
                          <p className="custom-text mb-0">{selectedSponsor.sponsorName}</p>
                          <p>{selectedSponsor.sponsorEmail}</p>
                        </div>
                      </div>
                      <span className={`badge ${levelClass[selectedSponsor.sponsorLevel]?.class}`}>
                        <i className={levelClass[selectedSponsor.sponsorLevel]?.icon}></i>
                        {selectedSponsor.sponsorLevel}
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
                            <p className="text-gray-9">{selectedSponsor.sponsorPhone}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Website</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorWebsite}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Address</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorAddress}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorRepresentativeName}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent Position</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorRepresentativePosition}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent Phone</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorRepresentativePhone}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent Email</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorRepresentativeEmail}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="custom-text">Contract detail</p>
                    <div>
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Status</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorStatus}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Start</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorStartDate}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">End</p>
                            <p className="text-gray-9">{selectedSponsor.sponsorEndDate}</p>
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
      <div className="modal fade" id="edit-sponsor" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Sponsor</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <SponsorUpload sponsor={selectedSponsor} setSponsor={setSelectedSponsor} />
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorName || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorName && <p className="text-red-500 text-sm">{empty.sponsorName}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorEmail || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorEmail && <p className="text-red-500 text-sm">{empty.sponsorEmail}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Address <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorAddress || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorAddress: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorAddress && <p className="text-red-500 text-sm">{empty.sponsorAddress}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorPhone || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorPhone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorPhone && <p className="text-red-500 text-sm">{empty.sponsorPhone}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Website <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorWebsite || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorWebsite: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorWebsite && <p className="text-red-500 text-sm">{empty.sponsorWebsite}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Name <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorRepresentativeName || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorRepresentativeName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativeName && <p className="text-red-500 text-sm">{empty.sponsorRepresentativeName}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Position <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorRepresentativePosition || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorRepresentativePosition: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativePosition && <p className="text-red-500 text-sm">{empty.sponsorRepresentativePosition}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Email <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorRepresentativeEmail || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorRepresentativeEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativeEmail && <p className="text-red-500 text-sm">{empty.sponsorRepresentativeEmail}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Phone <span className="required">*</span></label>
                        <input
                          type="text"
                          className="input-field"
                          value={selectedSponsor?.sponsorRepresentativePhone || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorRepresentativePhone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {empty.sponsorRepresentativePhone && <p className="text-red-500 text-sm">{empty.sponsorRepresentativePhone}</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Type <span className="required">*</span></label>
                        <select
                          className="input-select"
                          value={selectedSponsor?.sponsorType || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorType: e.target.value,
                            }))
                          }
                        >
                          <option value="">-- Select Type --</option>
                          <option value="Financialive">Financial Sponsorship</option>
                          <option value="In-kind">In-kind Sponsorship</option>
                          <option value="Media">Media Sponsorship</option>
                          <option value="Promotional">Promotional Partners</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Level <span className="required">*</span></label>
                        <select
                          className="input-select"
                          value={selectedSponsor?.sponsorLevel || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorLevel: e.target.value,
                            }))
                          }
                        >
                          <option value="">-- Select Level --</option>
                          <option value="Diamond">Diamond</option>
                          <option value="Gold">Gold</option>
                          <option value="Silver">Silver</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status <span className="required">*</span></label>
                        <select
                          className="input-select"
                          value={selectedSponsor?.sponsorStatus || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorStatus: e.target.value,
                            }))
                          }
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Start Date <span className="required">*</span></label>
                        <input
                          type="date"
                          className="input-field"
                          value={selectedSponsor?.sponsorStartDate || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorStartDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">End Date <span className="required">*</span></label>
                        <input
                          type="date"
                          className="input-field"
                          value={selectedSponsor?.sponsorEndDate || ""}
                          onChange={(e) =>
                            setSelectedSponsor((prev) => ({
                              ...prev,
                              sponsorEndDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={editSponsorHandle}>Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="page-breadcrumb">
        <div className="my-auto mb-2">
          <h2 className="container-title">Sponsor</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Sponsor
              </li>
            </ol>
          </nav>
        </div>
        <div className="export-add-sponsor">
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
            <a href="#" className="btn btn-primary mr-2" onClick={handleImport}>
              <i className="ti ti-file-arrow-left"></i> Import
            </a>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-2">
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#existing-sponsors">
              <i className="ti ti-circle-plus me-2"></i> Add Sponsor
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
                  <i className="ti ti-building fs-16"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Total sponsors</p>
                  <h4 className="number">{totalSponsors}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">
                <span className="card-avatar diamond">
                  <i className="ti ti-diamond"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Diamond</p>
                  <h4 className="number">{diamondSponsors}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">
                <span className="card-avatar gold">
                  <i className="ti ti-coins"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Gold</p>
                  <h4 className="number">{goldSponsors}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">
                <span className="card-avatar silver">
                  <i className="ti ti-coins"></i>
                </span>
                <div className="ms-2">
                  <p className="card-title">Silver</p>
                  <div className="number">{silverSponsors}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5>Sponsor List</h5>
          <div className="custom-dropdown" ref={dropdownLevelRef}>
            <button className="custom-dropdown-toggle" onClick={toggleDropdownLevel}>
              {selectedLevel === "" ? "All Levels" : selectedLevel}
            </button>
            {isOpenLevel && (
              <ul className="custom-dropdown-menu">
                {["All Levels", "Diamond", "Gold", "Silver"].map((option) => (
                  <li key={option} onClick={() => handleLevel(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="row table-length-filter">
          <div className="col-custom">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                Round Per page
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
                  className="form-select form-select-sm"
                >
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
                <input
                  type="search"
                  value={searchTerm}
                  className="form-control form-control-sm"
                  placeholder="Search by sponsor name, email"
                  aria-controls="DataTables_Table_0"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="col-sm-12 table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>Sponsor name</th>
                <th>Sponsorship Level</th>
                <th>Email</th>
                <th>Represent</th>
                <th>Tel</th>
                <th>Website</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentSponsors) && currentSponsors.map((sponsor, index) => (
                <tr key={index}>
                  <td>
                    <div className="avt-name">
                      <div className="avatar">
                        <img
                          src={sponsor.sponsorLogo}
                          alt={sponsor.sponsorName}
                          className="img-fluid"
                          style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="ms-2">
                        <a href="#">
                          <h6>{sponsor.sponsorName}</h6>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>{sponsor.sponsorLevel}</td>
                  <td>{sponsor.sponsorEmail}</td>
                  <td>{sponsor.sponsorRepresentativeName}</td>
                  <td>{sponsor.sponsorPhone}</td>
                  <td>{sponsor.sponsorWebsite}</td>
                  <td>
                    <span
                      className={`badge bg-${sponsor.sponsorStatus === "Active" ? "success" : "danger"}`}
                    >
                      {sponsor.sponsorStatus}
                    </span>
                  </td>
                  <td>
                    <div className="table-action">
                      <button
                        className="btn btn-detail"
                        data-bs-toggle="modal"
                        data-bs-target="#sponsor-detail"
                        onClick={() => setSelectedSponsor(sponsor)}
                      >
                        <i className="ti ti-eye"></i>
                      </button>
                      <button
                        className="btn btn-edit"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-sponsor"
                        onClick={() => setSelectedSponsor(sponsor)}
                      >
                        <i className="ti ti-pencil"></i>
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteSponsor(sponsor)}
                      >
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
              Showing {startIndex + 1} - {endIndex} of {sponsors.length} entries
            </div>
          </div>
          <div className="col-custom">
            <div className="dataTables_paginate paging_numbers" id="DataTables_Table_0_paginate">
              <ul className="pagination">
                <li className="paginate_button">
                  <button
                    className="page-link"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <i
                      className="ti ti-chevron-left"
                      style={{ opacity: `${currentPage === 1 ? "0.5" : "1"}`, fontWeight: "600" }}
                    ></i>
                  </button>
                </li>
                <li className="paginate_button page-item active">
                  <a
                    aria-controls="DataTables_Table_0"
                    role="link"
                    aria-current="page"
                    data-dt-idx="0"
                    tabIndex="0"
                    className="page-link"
                  >
                    {currentPage}
                  </a>
                </li>
                <li className="paginate_button">
                  <button
                    className="page-link"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <i
                      className="ti ti-chevron-right"
                      style={{ opacity: `${currentPage === totalPages ? "0.5" : "1"}`, fontWeight: "600" }}
                    ></i>
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

export default Sponsor;