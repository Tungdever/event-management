import React from 'react'
import "../Checkout/checkout-page.css"
import { useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import VNPAY from "../../assets/VNPAY.jpeg";
import momo from "../../assets/MoMo.png";
import { toast } from 'react-toastify';
const CheckoutPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state;
  const total = checkoutData?.tickets?.reduce((sum, ticket) => {
    return sum + ticket.price * ticket.quantity;
  }, 0);
  const [method, setMethod] = useState("");
  const handleClick = (method) => {
    setMethod(method);
  };
  const checkoutHandle = async () => {
    if (method === "") {
      toast.warn("Select the payment method!");
      return;
    }
    const token = localStorage.getItem('token'); // 'token' là tên của key trong localStorage
    let userId;
    if (token) {
      // Giải mã phần payload của JWT (tách payload khỏi token)
      const payload = token.split('.')[1]; // Token thường có cấu trúc: [header].[payload].[signature]
      // Giải mã Base64 (JWT payload là một chuỗi Base64)
      const decodedPayload = JSON.parse(atob(payload));
      // Lấy giá trị userId từ payload
      userId = decodedPayload.userId;
    } else {
      toast.error("Token does not exist.");
    }
    const tickets = checkoutData?.tickets?.reduce((acc, ticket) => {
      acc[ticket.ticketId] = ticket.quantity;
      return acc;
    }, {});
    const data = {
      "orderInfo": checkoutData?.eventData.eventName,
      "eventId": checkoutData?.eventData.eventId,
      "amount": total,
      "userId": userId,
      "tickets": tickets
    }
    if (method === "MoMo") {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/payment/create-momo', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        window.location.href = response.data.payUrl;
      } catch (error) {
        toast.error("Payment via Momo failed. Please try again.");
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/payment/create-vnpay', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        window.location.href = response.data.paymentUrl;
      } catch (error) {
        toast.error("Payment via VNPay failed. Please try again.");
        console.error(error);
      }
    }

  };
  return (
    <div className="checkout-page-container">
      <div className="flex flex-wrap max-w-[950px] bg-white rounded-[12px] p-5 gap-[60px]">
        <div className="flex flex-col flex-1 min-w-[500px]">
          <span className="font-normal text-black text-[25px] mb-[25px]">Payment Method</span>
          <div
            className={`flex items-center justify-between p-[15px] rounded-[8px] border cursor-pointer mb-[15px] ${method === "MoMo" ? "border-2 border-blue-600 shadow-md bg-blue-50" : "border-[#e8e9eb]"
              }`}
            onClick={() => handleClick("MoMo")}
          >
            <div className="flex">
              <img className="mr-1" src={momo} alt="MoMo" width="25" />
              <span>MoMo</span>
            </div>
          </div>

          <div
            className={`flex items-center justify-between p-[15px] rounded-[8px] border cursor-pointer mb-[15px] ${method === "VNPAY" ? "border-2 border-blue-600 shadow-md bg-blue-50" : "border-[#e8e9eb]"
              }`}
            onClick={() => handleClick("VNPAY")}
          >
            <div className="flex">
              <img className="mr-1" src={VNPAY} alt="VNPAY" width="80px" />
              <span>VNPAY</span>
            </div>
          </div>


        </div>
        <div className="flex-1 bg-[#f5f8ff] rounded-[12px] p-5">
          <div className="flex flex-col items-center gap-2.5 bg-white p-2.5 rounded-[10px] mb-5">
            <img
              src={checkoutData?.eventData.eventImages}
              alt="img"
            />
            <div className="flex flex-col items-start bg-white">
              <span>
                {checkoutData?.eventData.eventName}
              </span>
              <span className="checkout-page-text-title-price checkout-page-price">{checkoutData?.eventData.amount}</span>

            </div>
          </div>

          
          <div className="flex flex-col items-start justify-start gap-2.5 bg-white p-2.5 rounded-[10px] mb-5">
            <span className="checkout-page-text-detail">Payment Details</span>
            <div className="w-full flex flex-col items-start justify-start bg-white rounded-[10px] mb-2.5">
              {checkoutData?.tickets &&
                checkoutData?.tickets.map((ticket, index) => {
                  const s = ticket.price * ticket.quantity;
                  return (
                    <div key={index} className="w-full">
                      <div className="flex w-full items-center justify-between bg-white py-1.5">
                        <span>{ticket.ticketName} x{ticket.quantity}</span>
                        <span className="text-right w-24">{s?.toFixed(2)}Đ</span>
                      </div>
                    </div>
                  );
                })}
              <div className="mt-2.5 flex w-full items-center justify-between bg-white border-t border-[#E7E9EB] pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-right w-24 font-semibold">{total?.toFixed(2)}Đ</span>
              </div>
            </div>

          </div>
          <div className="flex items-start justify-center p-1.5 bg-[#408BFC] text-white no-underline rounded-[10px] cursor-pointer" onClick={checkoutHandle}>
            Pay Now
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage