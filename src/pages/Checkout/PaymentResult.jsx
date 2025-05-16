import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentResultPage() {
  const [data, setData] = useState(null);
  const linkEvent = localStorage.getItem('eventCheckout');
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const query = new URLSearchParams(window.location.search);
      const orderCode = query.get("orderCode");
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/payment/status/${orderCode}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPaymentStatus();
  }, []);

  return (

    <div className="max-w-xl px-6 py-8 mx-auto bg-white border shadow-sm rounded-xl mt-20">
      <div className="mb-6 border-b pb-4">
        <h3 className="text-2xl font-semibold text-gray-700 text-center">KẾT QUẢ THANH TOÁN</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Mã giao dịch:</span>
          <span className="text-gray-900 font-semibold">{data?.referenceCode}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Số tiền:</span>
          <span className="text-gray-900 font-semibold">{data?.transactionAmount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Sự kiện:</span>
          <span className="text-gray-900">{data?.transactionInfo}</span>
        </div>

        {data?.message && (
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Lỗi thanh toán:</span>
            <span className="text-red-600">{data?.message}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Tình trạng:</span>
          <span
            className={`font-semibold ${data?.transactionStatus === 'Thành công'
              ? 'text-green-600'
              : 'text-yellow-600'
              }`}
          >
            {data?.transactionStatus}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-6">
        <button
          onClick={() => window.location.href = linkEvent}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition duration-300"
        >
          Về trang sự kiện
        </button>
        <button
          onClick={() => window.location.href = '/myinvoices'}
          className="px-5 py-2.5 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-50 transition duration-300"
        >
          Xem đơn của tôi
        </button>
      </div>
    </div>

  );
}
