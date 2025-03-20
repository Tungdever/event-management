import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "./sponsor.css";
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../fonts/Times New Roman";
const Sponsor = () => {

  const [selectedLevel, setSelectedLevel] = useState("Select level");
  const [selectedExport, setSelectedExport] = useState("Export");

  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);

  const dropdownExportRef = useRef(null);
  const dropdownLevelRef = useRef(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const levelClass = {
    Diamond: { class: "badge-diamond", icon: "ti ti-diamond" },
    Gold: { class: "badge-gold", icon: "ti ti-coins" },
    Silver: { class: "badge-silver", icon: "ti ti-coins" },
  };

  const [sponsors, setSponsors] = useState([
    {
      sponsor_id: "1",
      sponsor_name: "FPT",
      sponsor_logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/FPT_Software_Logo.png",
      sponsor_email: "fpt@gmail.com",
      sponsor_level: "Gold",
      sponsor_representative_name: "Nguyễn Văn A",
      sponsor_representative_position: "",
      sponsor_representative_email: "anv@gmail.com",
      sponsor_representative_phone: "",
      sponsor_tel: "012345xxxx",
      sponsor_website: "FPT.vn",
      sponsor_type: "incorporation",
      sponsor_amount: "100000000",
      sponsor_contribution: "",
      sponsor_status: "Active",
      sponsor_contract: "contract1.pdf",
      sponsor_start_date: "18/03/2025",
      sponsor_end_date: "18/04/2025",
    },
    {
      sponsor_id: "2",
      sponsor_name: "BIDV",
      sponsor_logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Logo_BIDV.svg",
      sponsor_email: "bidv@gmail.com",
      sponsor_level: "Silver",
      sponsor_representative_name: "Nguyễn Văn B",
      sponsor_representative_position: "",
      sponsor_representative_email: "bnv@gmail.com",
      sponsor_representative_phone: "",
      sponsor_tel: "012345xxxx",
      sponsor_website: "BIDV.vn",
      sponsor_type: "incorporation",
      sponsor_amount: "100000000",
      sponsor_contribution: "",
      sponsor_status: "Expired",
      sponsor_contract: "contract2.pdf",
      sponsor_start_date: "18/03/2025",
      sponsor_end_date: "18/04/2025",
    },
    {
      sponsor_id: "3",
      sponsor_name: "Intel",
      sponsor_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_light_blue%29.svg/320px-Intel_logo_%282020%2C_light_blue%29.svg.png",
      sponsor_email: "intel@gmail.com",
      sponsor_level: "Diamond",
      sponsor_representative_name: "Nguyễn Văn C",
      sponsor_representative_position: "",
      sponsor_representative_email: "cnv@gmail.com",
      sponsor_representative_phone: "",
      sponsor_tel: "012345xxxx",
      sponsor_website: "Intel.vn",
      sponsor_type: "incorporation",
      sponsor_amount: "100000000",
      sponsor_contribution: "",
      sponsor_status: "Canceled",
      sponsor_contract: "contract3.pdf",
      sponsor_start_date: "18/03/2025",
      sponsor_end_date: "18/04/2025",
    },
  ]);
  const totalSponsors = sponsors.length;
  const diamondSponsors = sponsors.filter(sponsor => sponsor.sponsor_level === "Diamond").length;
  const goldSponsors = sponsors.filter(sponsor => sponsor.sponsor_level === "Gold").length;
  const silverSponsors = sponsors.filter(sponsor => sponsor.sponsor_level === "Silver").length;
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Times New Roman");
    doc.addFont('Times New Roman.ttf', 'Times New Roman', 'normal');
    doc.text("Sponsor List", 14, 10);

    const tableColumn = ["Name", "Level", "Email", "Contact", "Phone", "Website"];
    const tableRows = sponsors.map((sponsor) => [
      sponsor.sponsor_name,
      sponsor.sponsor_level,
      sponsor.sponsor_email,
      sponsor.sponsor_contact,
      sponsor.sponsor_tel,
      sponsor.sponsor_website,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("sponsor_list.pdf");
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sponsors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sponsors");

    // Xuất file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "sponsor_list.xlsx");
  };


  const handleExport = (option) => {
    if (option === "Export as PDF") {
      exportToPDF();
    } else if (option === "Export as Excel") {
      exportToExcel();
    }
    setIsOpenExport(false);
  };
  const handleDeleteSponsor = (selectedSponsor) => {
    const updatedSponsors = sponsors.filter(sponsor => sponsor.sponsor_id !== selectedSponsor.sponsor_id);
    setSponsors(updatedSponsors);
    setSelectedSponsor(null);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(sponsors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, sponsors.length);
  const currentSponsors = sponsors.slice(startIndex, endIndex);
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
    <div className="sponsor-container">
      <div className="modal fade" id="add-sponsor" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Sponsor</h4>
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
                        <div className="upload-title">Upload Sponsor Image</div>
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

                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Address <span className="required">*</span></label>
                        <input type="text" className="input-field" />
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
                        <label className="form-label">Website <span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>

                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Name <span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Positon<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Email<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Phone<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Type<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Amount<span className="required">*</span></label>
                        <input type="text" className="input-field" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Contribution<span className="required">*</span></label>
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
                <button type="submit" className="btn btn-primary">Add Sponsor</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="sponsor-detail" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sponsor detail</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="moday-body">
              {selectedSponsor ? (
                <>
                  <div className="p-3">
                    <div className="custom-body-header p-3">
                      <div className="file-name-icon">
                        <a href="#" className="custom-avatar-2">
                          <img src={selectedSponsor.sponsor_logo} className="img-fluid" alt="img"></img>
                        </a>
                        <div>
                          <p className="custom-text mb-0">{selectedSponsor.sponsor_name}</p>
                          <p>{selectedSponsor.sponsor_email}</p>
                        </div>
                      </div>
                      <span className={`badge ${levelClass[selectedSponsor.sponsor_level]?.class}`}>
                        <i className={levelClass[selectedSponsor.sponsor_level]?.icon}></i>
                        {selectedSponsor.sponsor_level}
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
                            <p className="text-gray-9">{selectedSponsor.sponsor_tel}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Website</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_website}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Addresss</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_address}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_representative_name}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent Positon</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_representative_position}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent Phone</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_representative_phone}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Represent Email</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_representative_email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="custom-text">Contract detail</p>
                    <div>
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Contract</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_contract}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Amount</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_amount}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Contribution</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_contribution}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Status</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_status}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Start</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_start_date}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">End</p>
                            <p className="text-gray-9">{selectedSponsor.sponsor_end_date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Register Date</p>
                            <p className="text-gray-9">12/09/2024</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="fs-12 mb-0">Expiring On</p>
                            <p className="text-gray-9">11/10/2024</p>
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
      <div className="modal fade" id="edit-sponsor" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Sponsor</h4>
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
                        <div className="upload-title">Upload Sponsor Image</div>
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
                        <input type="email" className="input-field" value={selectedSponsor?.sponsor_name || ""} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <input type="email" className="input-field" value={selectedSponsor?.sponsor_email || ""} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Address <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_address || ""} />
                      </div>
                    </div>

                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_tel || ""} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Website <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_website || ""} />
                      </div>
                    </div>

                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Name <span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_representative_name || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Positon<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_representative_position || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Email<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_representative_email || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Represent Phone<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_representative_phone || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Type<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_type || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Amount<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_amount || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Contribution<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_contribution || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Contract<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_contract || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Start Date<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_start_date || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">End Date<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_end_date || ""} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-group">
                        <label className="form-label">Status<span className="required">*</span></label>
                        <input type="text" className="input-field" value={selectedSponsor?.sponsor_status} />
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
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sponsor">
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
          <h5>
            Sponsor List
          </h5>
          <div className="custom-dropdown" ref={dropdownLevelRef}>
            <button className="custom-dropdown-toggle" onClick={toggleDropdownLevel}>
              {selectedLevel}
            </button>
            {isOpenLevel && (
              <ul className="custom-dropdown-menu">
                {["Diamond", "Gold", "Silver"].map((option) => (
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
                <th>Sponsor name</th>
                <th>Sponsorship Level</th>
                <th>Email</th>
                <th>Represent</th>
                <th>Tel</th>
                <th>Website</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSponsors.map((sponsor, index) => (
                <tr key={index}>
                  <td>
                    <div className="avt-name">
                      <div className="avatar">
                        <img
                          src={sponsor.sponsor_logo}
                          alt={sponsor.sponsor_name}
                          className="img-fluid"
                          style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="ms-2">
                        <a href="#">
                          <h6>{sponsor.sponsor_name}</h6>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>{sponsor.sponsor_level}</td>
                  <td>{sponsor.sponsor_email}</td>
                  <td>{sponsor.sponsor_contact}</td>
                  <td>{sponsor.sponsor_tel}</td>
                  <td>{sponsor.sponsor_website}</td>
                  <td>
                    <span
                      className={`badge bg-${sponsor.status === "Approved" ? "success" : sponsor.status === "Pending" ? "warning" : "danger"}`}
                    >
                      {sponsor.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-action">
                      <button className="btn btn-detail" data-bs-toggle="modal" data-bs-target="#sponsor-detail" onClick={() => setSelectedSponsor(sponsor)} >
                        <i className="ti ti-eye"></i>
                      </button>

                      <button className="btn btn-edit" data-bs-toggle="modal" data-bs-target="#edit-sponsor" onClick={() => setSelectedSponsor(sponsor)}>
                        <i className="ti ti-pencil"></i>
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDeleteSponsor(sponsor)}>
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

export default Sponsor;
