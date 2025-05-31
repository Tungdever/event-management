import { useEffect, useState } from "react";
import imgTicket from "../../assets/NoOrder.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Scanner } from "@yudiel/react-qr-scanner";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const TicketDashboard = () => {
  const [stats, setStats] = useState({});
  const [ticketTypes, setTicketTypes] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [checkInTickets, setCheckInTickets] = useState([]);
  const [eventInfo, setEventInfo] = useState({});
  const { eventId } = useParams();
  const [searchTicketTerm, setSearchTicketTerm] = useState("");
  const [searchOrderTerm, setSearchOrderTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isScanning, setIsScanning] = useState(false);
  const [qrResults, setQrResults] = useState([]);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false); // State để kiểm soát dropdown
  const [exportOption, setExportOption] = useState("all"); // Tùy chọn xuất file

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch stats
    axios
      .get(`http://localhost:8080/api/ticket/${eventId}/stats`, config)
      .then((res) => setStats(res.data))
      .catch((err) => toast.error("Failed to fetch stats"));

    // Fetch ticket types
    axios
      .get(`http://localhost:8080/api/ticket/${eventId}/ticket-types`, config)
      .then((res) => setTicketTypes(res.data))
      .catch((err) => toast.error("Failed to fetch ticket types"));

    // Fetch recent orders
    axios
      .get(`http://localhost:8080/api/ticket/${eventId}/recent-orders`, config)
      .then((res) => setRecentOrders(res.data))
      .catch((err) => toast.error("Failed to fetch recent orders"));

    // Fetch check-in tickets
    axios
      .get(`http://localhost:8080/api/ticket/${eventId}/check-in-tickets`, config)
      .then((res) => setCheckInTickets(res.data))
      .catch((err) => toast.error("Failed to fetch check-in tickets"));
  }, [eventId]);

  // Hàm xử lý check-in
  const handleCheckIn = async (ticketCode) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `http://localhost:8080/api/ticket/${eventId}/check-in/${ticketCode}`,
        config
      );
      toast.success(`Check-in successful for ${ticketCode}!`);
      const updatedTickets = await axios.get(
        `http://localhost:8080/api/ticket/${eventId}/check-in-tickets`,
        config
      );
      setCheckInTickets(updatedTickets.data);
      const updatedStats = await axios.get(
        `http://localhost:8080/api/ticket/${eventId}/stats`,
        config
      );
      setStats(updatedStats.data);
      return true;
    } catch (err) {
      toast.error(
        `Check-in failed for ${ticketCode}: ${err.response?.data?.message || err.message}`
      );
      return false;
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key && prevConfig.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Sort data based on sortConfig
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filter and sort recent orders
  const filteredRecentOrders = recentOrders.filter(
    (order) =>
      order.orderId?.toLowerCase().includes(searchOrderTerm.toLowerCase()) ||
      order.name?.toLowerCase().includes(searchOrderTerm.toLowerCase())
  );

  const sortedRecentOrders = sortConfig.key
    ? sortData(filteredRecentOrders, sortConfig.key, sortConfig.direction)
    : filteredRecentOrders;

  // Filter and sort check-in tickets
  const filteredCheckInTickets = checkInTickets.filter(
    (ticket) =>
      ticket.ticketCode?.toLowerCase().includes(searchTicketTerm.toLowerCase())
  );

  const sortedCheckInTickets = sortConfig.key
    ? sortData(filteredCheckInTickets, sortConfig.key, sortConfig.direction)
    : filteredCheckInTickets;

  const handleClearSearchOrder = () => {
    setSearchOrderTerm("");
  };
  const handleClearSearchTicket = () => {
    setSearchTicketTerm("");
  };

  // Hàm xuất file Excel
  const exportToExcel = () => {
    let dataToExport = [...sortedCheckInTickets];

    // Lọc dữ liệu theo tùy chọn
    if (exportOption === "checked") {
      dataToExport = dataToExport.filter((ticket) => ticket.status === "Checked");
    } else if (exportOption === "unchecked") {
      dataToExport = dataToExport.filter((ticket) => ticket.status !== "Checked");
    }

    // Chuẩn bị dữ liệu cho Excel
    const worksheetData = dataToExport.map((ticket) => ({
      "Ticket Code": ticket.ticketCode,
      "Status": ticket.status,
      "Check-in Date": ticket.checkDate || "N/A",
      "Ticket Type": ticket.ticketType,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CheckInTickets");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(dataBlob, `CheckInTickets_${eventId}_${exportOption}.xlsx`);
    toast.success("File exported successfully!");
    setIsExportDropdownOpen(false); // Đóng dropdown sau khi xuất
  };

  // Pie chart data for ticket type distribution
  const ticketTypeChartData = {
    labels: ticketTypes.map((t) => t.ticketType),
    datasets: [
      {
        data: ticketTypes.map((t) => parseInt(t.sold.split("/")[0])),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Pie chart data for ticket status
  const ticketStatusChartData = {
    labels: ["Sold", "Checked", "Canceled"],
    datasets: [
      {
        data: [
          parseInt(stats.ticketsSold?.split("/")[0]) || 0,
          parseInt(stats.ticketsChecked) || 0,
          parseInt(stats.ticketsCanceled) || 0,
        ],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            {isScanning ? "Close QR Scanner" : "Scan QR Code"}
          </button>
          <div className="relative">
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export to Excel
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setExportOption("all");
                    exportToExcel();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Export All
                </button>
                <button
                  onClick={() => {
                    setExportOption("checked");
                    exportToExcel();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Export Checked
                </button>
                <button
                  onClick={() => {
                    setExportOption("unchecked");
                    exportToExcel();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Export Unchecked
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      {isScanning && (
        <div className="mt-6 bg-white p-4 rounded-md shadow border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Scan QR Code to Check-in</h2>
          <div
            className="mt-4"
            style={{ width: "100%", maxWidth: "400px", margin: "auto" }}
          >
            <Scanner
              onScan={(result) => {
                if (result.length > 0) {
                  const ticketCode = result[0].rawValue;
                  if (!qrResults.includes(ticketCode)) {
                    setQrResults([...qrResults, ticketCode]);
                    handleCheckIn(ticketCode);
                  }
                }
              }}
              onError={(error) => {
                toast.error("Error accessing camera: " + error.message);
                setIsScanning(false);
              }}
            />
            {qrResults.length > 0 && (
              <div className="mt-2 text-center">
                <p className="font-semibold">Scanned Tickets:</p>
                <ul className="list-disc list-inside">
                  {qrResults.map((code, index) => (
                    <li className="list-none" key={index}>
                      {code}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-md shadow border border-orange-600">
          <div className="text-orange-600 p-2">Tickets Sold</div>
          <div className="text-2xl font-bold text-orange-900 p-2">
            {stats.ticketsSold || "0/0"}
          </div>
        </div>
        <div className="p-4 bg-white rounded-md shadow border border-orange-600">
          <div className="text-orange-600 p-2">Tickets Checked</div>
          <div className="text-2xl font-bold text-orange-900 p-2">
            {stats.ticketsChecked || "0"}
          </div>
        </div>
        <div className="p-4 bg-white rounded-md shadow border border-orange-600">
          <div className="text-orange-600 p-2">Tickets Canceled</div>
          <div className="text-2xl font-bold text-orange-900 p-2">
            {stats.ticketsCanceled || "0"}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ticket Type Distribution</h2>
          <div style={{ height: "300px" }}>
            <Pie data={ticketTypeChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ticket Status</h2>
          <div style={{ height: "300px" }}>
            <Pie data={ticketStatusChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Sales by Ticket Type</h2>
        <table className="mt-4 w-full bg-white rounded-md border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("ticketType")}
              >
                Ticket Type{" "}
                {sortConfig.key === "ticketType" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("sold")}
              >
                Sold{" "}
                {sortConfig.key === "sold" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticket, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{ticket.ticketType}</td>
                <td className="px-4 py-2">{ticket.sold}</td>
                <td className="px-4 py-2">{ticket.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders"
              className="p-2 border border-gray-300 rounded-md"
              value={searchOrderTerm}
              onChange={(e) => setSearchOrderTerm(e.target.value)}
            />
            {searchOrderTerm.length > 0 && (
              <button
                onClick={handleClearSearchOrder}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        <table className="mt-4 w-full bg-white rounded-[20px] border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("orderId")}
              >
                Order #{" "}
                {sortConfig.key === "orderId" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                Quantity{" "}
                {sortConfig.key === "quantity" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("ticketType")}
              >
                Ticket Type{" "}
                {sortConfig.key === "ticketType" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date{" "}
                {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRecentOrders.length === 0 ? (
              <tr className="border-t">
                <td colSpan="6" className="px-4 py-8 text-center text-gray-600">
                  <img
                    alt="No orders icon"
                    className="mx-auto mb-4"
                    src={imgTicket}
                    width="150"
                    height="150"
                  />
                  No orders for this event yet
                </td>
              </tr>
            ) : (
              sortedRecentOrders.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.ticketType}</td>
                  <td className="px-4 py-2">{order.price}</td>
                  <td className="px-4 py-2">{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Check-in Tickets</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets"
              className="p-2 border border-gray-300 rounded-md"
              value={searchTicketTerm}
              onChange={(e) => setSearchTicketTerm(e.target.value)}
            />
            {searchTicketTerm.length > 0 && (
              <button
                onClick={handleClearSearchTicket}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        <table className="mt-4 w-full bg-white rounded-[20px] border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("ticketCode")}
              >
                Ticket Code{" "}
                {sortConfig.key === "ticketCode" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("checkDate")}
              >
                Check-in Date{" "}
                {sortConfig.key === "checkDate" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("ticketType")}
              >
                Ticket Type{" "}
                {sortConfig.key === "ticketType" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCheckInTickets.length === 0 ? (
              <tr className="border-t">
                <td colSpan="4" className="px-4 py-8 text-center text-gray-600">
                  <img
                    alt="No check-in tickets icon"
                    className="mx-auto mb-4"
                    src={imgTicket}
                    width="150"
                    height="150"
                  />
                  No check-in tickets for this event yet
                </td>
              </tr>
            ) : (
              sortedCheckInTickets.map((ticket, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{ticket.ticketCode}</td>
                  <td className="px-4 py-2">{ticket.status}</td>
                  <td className="px-4 py-2">{ticket.checkDate}</td>
                  <td className="px-4 py-2">{ticket.ticketType}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketDashboard;