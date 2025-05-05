import React from "react";

const ReportOrder = () => {
  // Dữ liệu mẫu
  const reportData = [
    {
      eventName: "Hội chợ công nghệ 2025",
      ticketType: "Vé thường",
      price: 20,
      sold: 150,
    },
    {
      eventName: "Hội chợ công nghệ 2025",
      ticketType: "Vé VIP",
      price: 50,
      sold: 40,
    },
    {
      eventName: "Concert EDM Night",
      ticketType: "Early Bird",
      price: 30,
      sold: 120,
    },
    {
      eventName: "Concert EDM Night",
      ticketType: "Standard",
      price: 45,
      sold: 80,
    },
  ];

  // Tính toán tổng quan
  const totalOrders = reportData.length;
  const totalTicketsSold = reportData.reduce((acc, cur) => acc + cur.sold, 0);
  const totalRevenue = reportData.reduce(
    (acc, cur) => acc + cur.price * cur.sold,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Báo cáo đơn đặt vé
      </h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Tổng số đơn hàng</p>
          <h2 className="text-2xl font-bold text-blue-600">{totalOrders}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Tổng số vé bán ra</p>
          <h2 className="text-2xl font-bold text-green-600">
            {totalTicketsSold}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Tổng doanh thu</p>
          <h2 className="text-2xl font-bold text-rose-600">
            ${totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chi tiết theo loại vé
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                <th className="py-3 px-4">Sự kiện</th>
                <th className="py-3 px-4">Loại vé</th>
                <th className="py-3 px-4">Giá</th>
                <th className="py-3 px-4">Số lượng bán</th>
                <th className="py-3 px-4">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="py-3 px-4">{item.eventName}</td>
                  <td className="py-3 px-4">{item.ticketType}</td>
                  <td className="py-3 px-4">${item.price}</td>
                  <td className="py-3 px-4">{item.sold}</td>
                  <td className="py-3 px-4 font-semibold">
                    ${(item.price * item.sold).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportOrder;
