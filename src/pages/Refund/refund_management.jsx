import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "./refund-management.css";
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../fonts/Times New Roman";
const Refund = () => {

    const [selectedStatus, setSelectedStatus] = useState("Select status");
    const [isOpenExport, setIsOpenExport] = useState(false);
    const [isOpenStatus, setIsOpenStatus] = useState(false);
    const dropdownExportRef = useRef(null);
    const dropdownStatusRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // "approval" hoặc "reject"
    const [selectedRefund, setSelectedRefund] = useState(null);

    const [refunds, setRefunds] = useState([
        {
            id: 1,
            ticketId: "123456",
            eventName: "Tech Conference 2025",
            userName: "Nguyễn Văn A",
            userEmail: "nguyenvana@gmail.com",
            requestDate: "2025-03-20",
            reason: "Lịch trình thay đổi",
            amount: "$50",
            status: "Approval",
            notes: "",
        },
        {
            id: 2,
            ticketId: "654321",
            eventName: "AI Summit 2025",
            userName: "Trần Thị B",
            userEmail: "tranb@gmail.com",
            requestDate: "2025-03-21",
            reason: "Sự kiện bị hoãn",
            amount: "$75",
            status: "Processing",
            notes: "Đang xác minh thông tin",
        },
    ]);
    const totalRefunds = refunds.reduce((sum, refund) => sum + parseFloat(refund.amount.replace("$", "")), 0);
    const approval = refunds.filter(refund => refund.status === "Approval").length;
    const processing = refunds.filter(refund => refund.status === "Processing").length;
    const rejected = refunds.filter(refund => refund.status === "Rejected").length;

    const exportToPDF = () => {
        // const doc = new jsPDF();
        // doc.setFont("Times New Roman");
        // doc.addFont('Times New Roman.ttf', 'Times New Roman', 'normal');
        // doc.text("Refund List", 14, 10);

        // const tableColumn = ["Name", "Status", "Email", "Contact", "Phone", "Website"];
        // const tableRows = refunds.map((refund) => [
        //     refund.refund_name,
        //     refund.refund_level,
        //     refund.refund_email,
        //     refund.refund_contact,
        //     refund.refund_tel,
        //     refund.refund_website,
        // ]);

        // autoTable(doc, {
        //     head: [tableColumn],
        //     body: tableRows,
        //     startY: 20,
        // });

        // doc.save("refund_list.pdf");
    };
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(refunds);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Refunds");
        // Xuất file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(data, "refund_list.xlsx");
    };
    const handleExport = (option) => {
        if (option === "Export as PDF") {
            exportToPDF();
        } else if (option === "Export as Excel") {
            exportToExcel();
        }
        setIsOpenExport(false);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const totalPages = Math.ceil(refunds.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, refunds.length);
    const currentRefunds = refunds.slice(startIndex, endIndex);
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const toggleDropdownExport = () => {
        setIsOpenExport(!isOpenExport);
        setIsOpenStatus(false); // Đóng dropdown khác nếu đang mở
    };


    const toggleDropdownStatus = () => {
        setIsOpenStatus(!isOpenStatus);
        setIsOpenExport(false); // Đóng dropdown khác nếu đang mở
    };

    const handleStatus = (option) => {
        setSelectedStatus(option);
        setIsOpenStatus(false);
    };
    const openModal = (refund, type) => {
        setSelectedRefund(refund);
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleApprove = () => {
        setRefunds((prevRefunds) =>
            prevRefunds.map((refund) =>
                refund.id === selectedRefund.id ? { ...refund, status: "Approval" } : refund
            )
        );
        closeModal();
    };

    const handleReject = () => {
        setRefunds((prevRefunds) =>
            prevRefunds.map((refund) =>
                refund.id === selectedRefund.id ? { ...refund, status: "Rejected" } : refund
            )
        );
        closeModal();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownExportRef.current &&
                !dropdownExportRef.current.contains(event.target)
            ) {
                setIsOpenExport(false);
            }
            if (
                dropdownStatusRef.current &&
                !dropdownStatusRef.current.contains(event.target)
            ) {
                setIsOpenStatus(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="refund-container">

            <div className="page-breadcrumb">
                <div my-auto mb-2>
                    <h2 className="container-title">Refund</h2>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="#">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Refund
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="export-add-refund">
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

                </div>

            </div>
            <div className="row">
                <div className="col-custom col-lg-3 col-md-6">
                    <div className="card flex-fill">
                        <div className="custom-card-body">
                            <div className="custom-card-content">

                                <span className="card-avatar total">
                                    <i class="ti ti-credit-card-refund"></i>
                                </span>
                                <div className="ms-2">
                                    <p className="card-title">Total refunds money</p>
                                    <h4 className="number">{totalRefunds}</h4>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-custom col-lg-3 col-md-6">
                    <div className="card flex-fill">
                        <div className="custom-card-body">
                            <div className="custom-card-content">
                                <span className="card-avatar approval">
                                    <i class="ti ti-circle-check"></i>
                                </span>
                                <div className="ms-2">
                                    <p className="card-title">Approval</p>
                                    <h4 className="number">{approval}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-custom col-lg-3 col-md-6">
                    <div className="card flex-fill">
                        <div className="custom-card-body">

                            <div className="custom-card-content">

                                <span className="card-avatar processing">
                                    <i class="ti ti-clock-hour-4"></i>
                                </span>
                                <div className="ms-2">
                                    <p className="card-title">Processing</p>
                                    <h4 className="number">{processing}</h4>
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
                                    <div className="number">{rejected}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5>
                        Refund List
                    </h5>
                    <div className="custom-dropdown" ref={dropdownStatusRef}>
                        <button className="custom-dropdown-toggle" onClick={toggleDropdownStatus}>
                            {selectedStatus}
                        </button>
                        {isOpenStatus && (
                            <ul className="custom-dropdown-menu">
                                {["Approval", "Processing", "Rejected"].map((option) => (
                                    <li key={option} onClick={() => handleStatus(option)}>
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
                                <th>Ticket code</th>
                                <th>Event</th>
                                <th>Refunder</th>
                                <th>Refunder Email</th>
                                <th>Request Date</th>
                                <th>Reason</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRefunds.map((refund, index) => (
                                <tr key={index}>
                                    <td>{refund.ticketId}</td>
                                    <td>{refund.eventName}</td>
                                    <td>{refund.userName}</td>
                                    <td>{refund.userEmail}</td>
                                    <td>{refund.requestDate}</td>
                                    <td>{refund.reason}</td>
                                    <td>{refund.amount}</td>
                                    <td>
                                        <span
                                            className={`badge bg-${refund.status === "Approval" ? "approval" : refund.status === "Processing" ? "processing" : "rejected"}`}
                                        >
                                            <i class="ti ti-point-filled me-1"></i>{refund.status}
                                        </span>
                                    </td>
                                    <td>
                                        {(refund.status === "Processing" &&
                                            <div className="table-action">
                                                <button className="btn btn-approval" onClick={() => openModal(refund, "approval")}>
                                                    <i class="ti ti-check"></i>
                                                </button>

                                                <button className="btn btn-rejected" onClick={() => openModal(refund, "reject")}>
                                                    <i class="ti ti-x"></i>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="row table-info-paginate">
                    <div className="col-custom">
                        <div className="dataTables_info" id="DataTables_Table_0_info">
                            Showing {startIndex + 1} - {endIndex} of {refunds.length} entries
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
            {isModalOpen && selectedRefund && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform transition-all scale-100 opacity-100 animate-fade-in">

                        <h3 className="text-lg font-semibold text-gray-800">
                            {modalType === "approval" ? "Thông tin tài khoản hoàn tiền" : "Xác nhận từ chối hoàn tiền"}
                        </h3>
                        <div className="mt-4">
                            {modalType === "approval" ? (
                                <>
                                    <p><strong>Khách hàng:</strong> {selectedRefund.userName}</p>
                                    <p><strong>Email:</strong> {selectedRefund.userEmail}</p>
                                    <p><strong>Số tiền hoàn:</strong> {selectedRefund.amount}</p>
                                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                                    <p><strong>Số tài khoản:</strong> 0123456789</p>
                                </>
                            ) : (
                                <p>
                                    Bạn có chắc chắn muốn từ chối yêu cầu hoàn tiền của <strong>{selectedRefund.userName}</strong> không?
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2 hover:bg-gray-500"
                                onClick={closeModal}>
                                Hủy
                            </button>
                            <button className={`px-4 py-2 ${modalType === "approval" ? "bg-green-600" : "bg-red-600"} text-white rounded-md hover:bg-opacity-80`}
                                onClick={modalType === "approval" ? handleApprove : handleReject}>
                                {modalType === "approval" ? "Xác nhận hoàn tiền" : "Từ chối hoàn tiền"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Refund;
