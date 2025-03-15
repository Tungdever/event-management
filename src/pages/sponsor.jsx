import React, { useState, useRef, useEffect } from "react";
import "./sponsor.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
const Dashboard = () => {

  const [selectedLevel, setSelectedLevel] = useState("Select level");
  const [selectedExport, setSelectedExport] = useState("Export");

  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);

  const dropdownExportRef = useRef(null);
  const dropdownLevelRef = useRef(null);


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
  const handleExport = (option) => {
    setSelectedExport(option);
    setIsOpenExport(false);
  };

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event) => {
    event.preventDefault(); // Chặn reload trang
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const sponsors = [
    {
      sponsor_name: "FPT",
      sponsor_logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/FPT_Software_Logo.png",
      sponsor_email: "fpt@gmail.com",
      sponsor_level: "Gold",
      sponsor_contact: "Nguyễn Văn A",
      sponsor_tel: "012345xxxx",
      sponsor_website: "FPT.vn",
    },
    {
      sponsor_name: "BIDV",
      sponsor_logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Logo_BIDV.svg",
      sponsor_email: "bidv@gmail.com",
      sponsor_level: "Silver",
      sponsor_contact: "Nguyễn Văn B",
      sponsor_tel: "0123456xxx",
      sponsor_website: "Pending",
    },
    {
      sponsor_name: "Intel",
      sponsor_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_light_blue%29.svg/320px-Intel_logo_%282020%2C_light_blue%29.svg.png",
      sponsor_email: "intel@gmail.com",
      sponsor_level: "Diamond",
      sponsor_contact: "Nguyễn Văn C",
      sponsor_tel: "01234567xx",
      sponsor_website: "intel.com",
    },
  ];

  return (
    <div className="sponsor-container">
      <div className="page-breadcrumb">
        <div my-auto mb-2>
          <h2 className="checkout-page-title">Sponsor</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Sponsor Dashboard
              </li>
            </ol>
          </nav>
        </div>
        <div className="export-add-sponsor">
          <div>
            <div className="custom-dropdown" ref={dropdownExportRef}>

              <button className="custom-dropdown-toggle" onClick={toggleDropdownExport}>
                <i className="ti ti-file-export me-1"></i> {selectedExport}
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
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sponsor">
              <i className="ti ti-circle-plus me-2"></i> Add Sponsor
            </a>
          </div>
          <div className="modal fade" id="sponsor" tabindex="-1" aria-hidden="true">
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
                          <div className="avatar">
                            <img src="https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg" alt="img" />
                          </div>
                          <div className="profile-upload">
                            <div className="upload-title">Upload Sponsor Image</div>
                            <p className="upload-subtext">Image should be below 4 MB</p>
                            <div className="upload-btn">
                              <label htmlFor="upload-image">Upload</label>
                              <input type="file" id="upload-image" />
                              <a href="#" className="cancel-btn">Cancel</a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form input */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="form-group">
                            <label className="form-label">Name</label>
                            <input type="email" className="input-field" />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="input-field" />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <div className="form-group">
                            <label className="form-label">Address</label>
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
                            <label className="form-label">Website</label>
                            <input type="text" className="input-field" />
                          </div>
                        </div>

                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="form-group">
                            <label className="form-label">Represent<span className="required">*</span></label>
                            <input type="text" className="input-field" />
                          </div>
                        </div>

                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="form-group">
                            <label className="form-label">Represent URL</label>
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
        </div>

      </div>
      <div className="row">
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">

                <span class="card-avatar total">
                  <i class="ti ti-building fs-16"></i>
                </span>
                <div className="ms-2">
                  <p class="card-title">Total sponsors</p>
                  <h4 className="number">10</h4>
                </div>

              </div>

            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">
                <span class="card-avatar diamond">
                  <i class="ti ti-diamond"></i>
                </span>
                <div className="ms-2">
                  <p class="card-title">Diamond</p>
                  <h4 className="number">2</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">

              <div className="custom-card-content">

                <span class="card-avatar gold">
                  <i class="ti ti-coins"></i>
                </span>
                <div className="ms-2">
                  <p class="card-title">Gold</p>
                  <h4 className="number">5</h4>
                </div>

              </div>

            </div>
          </div>
        </div>
        <div className="col-custom col-lg-3 col-md-6">
          <div className="card flex-fill">
            <div className="custom-card-body">
              <div className="custom-card-content">

                <span class="card-avatar silver">
                  <i class="ti ti-coins"></i>
                </span>
                <div className="ms-2">
                  <p class="card-title">Silver</p>
                  <div className="number">3</div>
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
                Round Per page <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select form-select-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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
            {sponsors.map((sponsor, index) => (
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
                    <button className="btn btn-detail">
                      <i className="ti ti-eye"></i>
                    </button>
                    <button className="btn btn-edit">
                      <i className="ti ti-pencil"></i>
                    </button>
                    <button className="btn btn-delete">
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row table-info-paginate">
          <div className="col-custom">
            <div className="dataTables_info" id="DataTables_Table_0_info">
              Showing 1 - 10 of 10 entries
            </div>
          </div>
          <div className="col-custom">
            <div className="dataTables_paginate paging_numbers" id="DataTables_Table_0_paginate">
              <ul className="pagination">
                <li className="paginate_button page-item previous disabled">
                  <a aria-controls="DataTables_Table_0" aria-disabled="true" role="link" data-dt-idx="previous" tabindex="-1" className="page-link"><i className="ti ti-chevron-left"></i> </a>
                </li>
                <li className="paginate_button page-item active">
                  <a href="#" aria-controls="DataTables_Table_0" role="link" aria-current="page" data-dt-idx="0" tabindex="0" className="page-link">1</a>
                </li>
                <li className="paginate_button page-item next disabled">
                  <a aria-controls="DataTables_Table_0" aria-disabled="true" role="link" data-dt-idx="next" tabindex="-1" className="page-link"><i className="ti ti-chevron-right"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
