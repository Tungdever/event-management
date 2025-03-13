import React from "react";
import "./sponsor.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import { useState } from "react";
const Dashboard = () => {
  const [selectedLevel, setSelectedLevel] = useState("Select level");
  const [selectedExport, setSelectedExport] = useState("Export");
  const handleSelect = (sponsor) => {
    setSelectedLevel(sponsor);
  };
  const handleExport = (select) => {
    setSelectedExport(select);
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
      <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
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
            <div className="dropdown dropdown-export">
              <button className="dropdown-toggle btn btn-white d-inline-flex align-items-center" type="button" data-bs-toggle="dropdown">
                {selectedExport}
              </button>
              <ul className="dropdown-menu">
                {["Export as PDF", "Export as Excel"].map((select) => (
                  <li key={select}>
                    <a className="dropdown-item" href="#" onClick={() => handleExport(select)}>
                      {select}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mb-2">
            <a href="#" data-bs-toggle="modal" data-bs-target="#add_sponsor" className="btn btn-primary d-flex align-items-center"><i className="ti ti-circle-plus me-2"></i>Add Sponsor</a>
          </div>
          <div className="modal fade" id="add_sponsor" style={{ display: "none" }} aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add New Sponsor</h4>
                  <button type="button" className="custom-btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="ti ti-x"></i></button>
                </div>
                <form>
                  <div className="modal-body">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                          <div class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                            <img src="https://smarthr.dreamstechnologies.com/laravel/template/public/build/img/profiles/avatar-30.jpg" alt="img" class="rounded-circle"></img>
                          </div>
                          <div class="profile-upload">
                            <div class="mb-2">
                              <h6 class="mb-1">Upload Sponsor Image</h6>
                              <p class="fs-12">Image should be below 4 mb</p>
                            </div>
                            <div class="profile-uploader d-flex align-items-center">
                              <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                                Upload
                                <input type="file" className="form-control image-sign" multiple=""></input>
                              </div>
                              <a href="javascript:void(0);" class="btn btn-light btn-sm">Cancel</a>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Name <span class="text-danger"> *</span></label>
                          <input type="text" class="form-control"></input>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Email</label>
                          <input type="email" class="form-control"></input>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="mb-3">
                          <label class="form-label">Address</label>
                          <input type="text" class="form-control"></input>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Phone Number <span class="text-danger"> *</span></label>
                          <input type="text" class="form-control"></input>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Website</label>
                          <input type="text" class="form-control"></input>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Represent<span class="text-danger"> *</span></label>
                          <input type="text" class="form-control"></input>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Represent URL</label>
                          <input type="text" class="form-control"></input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn btn-primary">Add Sponsor</button>
                  </div>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="card-container">
        <div class="sponsor-card">
          <div class="icon">🔶</div>
          <div className="ms-2">
            <div class="small-text">Total sponsor</div>
            <h4 class="number">10</h4>
          </div>
        </div>
        <div class="sponsor-card">
          <div class="icon">🟣</div>
          <div className="ms-2">
            <div class="small-text">Diamond</div>
            <h4 class="number">2</h4>
          </div>
        </div>
        <div class="sponsor-card">
          <div class="icon">🔷</div>
          <div className="ms-2">
            <div class="small-text">Gold Level</div>
            <h4 class="number">5</h4>
          </div>
        </div>
        <div class="sponsor-card">
          <div class="icon">🔶</div>
          <div className="ms-2">
            <div class="small-text">Silver Level</div>
            <div className="number">3</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>
            Sponsor List
          </h5>
          <div className="dropdown dropdown-level">
            <button className="dropdown-toggle btn btn-white d-inline-flex align-items-center" type="button" data-bs-toggle="dropdown">
              {selectedLevel}
            </button>
            <ul className="dropdown-menu">
              {["Diamond", "Gold", "Silver"].map((sponsor) => (
                <li key={sponsor}>
                  <a className="dropdown-item" href="#" onClick={() => handleSelect(sponsor)}>
                    {sponsor}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                Round Per page <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" class="form-select form-select-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                Entries
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="DataTables_Table_0_filter" id="dataTables_filter">
              <label>
                <input type="search" className="form-control form-control-sm" placeholder="Search" aria-controls="DataTables_Table_0"></input>
              </label>
            </div>
          </div>
        </div>
        <div class="col-sm-12 table-responsive">
          <table class="table table-hover">
            <thead class="thead-light">
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
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-md border rounded-circle d-flex align-items-center justify-content-center">
                        <img
                          src={sponsor.sponsor_logo}
                          alt={sponsor.sponsor_name}
                          className="img-fluid"
                          style={{ width: "28px", height: "28px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="ms-2">
                        <a href="#">
                          <h6 className="fw-bold m-0">{sponsor.sponsor_name}</h6>
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
                    <button className="btn btn-detail">
                      <i class="ti ti-eye"></i>
                    </button>
                    <button className="btn btn-edit">
                      <i class="ti ti-pencil"></i>
                    </button>
                    <button className="btn btn-delete">
                      <i class="ti ti-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-5">
            <div className="dataTables_info" id="DataTables_Table_0_info">
              Showing 1 - 10 of 10 entries
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
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
