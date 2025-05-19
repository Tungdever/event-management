import React, { useState } from "react";
import Swal from 'sweetalert2';
const RefundPage = () => {
  const [refundReason, setRefundReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const ticketDetails = {
    ticketId: "123456",
    eventName: "Tech Conference 2025",
    date: "March 30, 2025",
    price: "$50",
    paymentMethod: "Credit Card",
    refundDeadline: "March 25, 2025",
  };

  const refundReasons = [
    "Lịch trình thay đổi",
    "Sự kiện bị hoãn/hủy",
    "Mua nhầm vé",
    "Lý do cá nhân khác",
  ];

  const handleConfirmRefund = () => {
    if (!refundReason) {
      
      Swal.fire ({
        icon: 'error',
        title: 'error',
        text: 'Please select refund reason!',
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    setTimeout(() => {
      setRefundStatus("Processing");
      setTimeout(() => {
        setRefundStatus("Completed");
        setIsSubmitting(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Yêu cầu hoàn tiền
      </h2>

      {/* Thông tin vé */}
      <div className="border p-5 rounded-lg bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700">Thông tin vé</h3>
        <p className="text-gray-600">Ticket Code: <strong>{ticketDetails.ticketId}</strong></p>
        <p className="text-gray-600">Sự kiện: <strong>{ticketDetails.eventName}</strong></p>
        <p className="text-gray-600">Ngày: {ticketDetails.date}</p>
        <p className="text-gray-600">Giá: {ticketDetails.price}</p>
        <p className="text-gray-600">Phương thức thanh toán: {ticketDetails.paymentMethod}</p>
        <p className="text-gray-600 text-red-500">Hạn chót hoàn tiền: {ticketDetails.refundDeadline}</p>
      </div>

      {/* Chọn lý do hoàn tiền */}
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Chọn lý do hoàn tiền:</label>
        <select
          className="w-full p-3 border rounded-md bg-white shadow-sm"
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
        >
          <option value="">-- Chọn lý do --</option>
          {refundReasons.map((reason, index) => (
            <option key={index} value={reason}>{reason}</option>
          ))}
        </select>
      </div>

      {/* Nhập thông tin bổ sung */}
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-2">Mô tả chi tiết:</label>
        <textarea
          className="w-full p-3 border rounded-md bg-white shadow-sm resize-none"
          placeholder="Bạn có thể mô tả chi tiết lý do hoàn tiền..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows="4"
        />
      </div>

      {/* Nút gửi yêu cầu */}
      <button
        className="w-full bg-blue-600 text-white py-3 rounded-md mt-6 hover:bg-blue-700 transition disabled:bg-gray-400"
        onClick={handleConfirmRefund}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu hoàn tiền"}
      </button>

      {/* Hiển thị trạng thái hoàn tiền */}
      {refundStatus && (
        <div className="mt-6 text-center">
          {refundStatus === "Processing" && (
            <p className="text-yellow-600 font-semibold">Đang xử lý yêu cầu hoàn tiền...</p>
          )}
          {refundStatus === "Completed" && (
            <p className="text-green-600 font-semibold">
              Yêu cầu hoàn tiền đã được chấp nhận! Tiền sẽ được hoàn trong 5-7 ngày làm việc.
            </p>
          )}
        </div>
      )}

      {/* Xác nhận trước khi gửi yêu cầu */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">Xác nhận hoàn tiền</h3>
            <p className="text-gray-600 mt-2">
              Bạn có chắc chắn muốn yêu cầu hoàn tiền cho vé <strong>{ticketDetails.eventName}</strong> không?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2 hover:bg-gray-500"
                onClick={() => setShowConfirmation(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleSubmit}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundPage;
