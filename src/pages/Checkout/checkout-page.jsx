import React from 'react'
import "../Checkout/checkout-page.css"
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import VNPAY from "../../assets/VNPAY.jpeg";
import momo from "../../assets/MoMo.png";

const CheckoutPage = (props) => {
  const [selected, setSelected] = useState("option5");
  const [isOption2Expanded, setIsOption2Expanded] = useState(false);
  const location = useLocation();
  const checkoutData = location.state;
  return (
    <div className="checkout-page-container">
      <div className="checkout-page-checkout-page">
        <div className="checkout-page-column1">
          <span className="checkout-page-text-title">Payment Method</span>

          <div className="checkout__option1 focus:border-blue-500">
            <div className='flex'>
              <img className="mr-1" src={momo} alt="Visa" width="25" />
              <span className=" checkout-page-text checkout__option-text1">MoMo</span>
            </div>            
          </div>
          {/* Nhấn để mở hoặc đóng */}
          <div className="checkout__option2 focus:border-blue-500">
            <div className='flex'>
              <img className="mr-1" src={VNPAY} alt="Visa" width="80px" />
              <span className="checkout-page-text checkout__option-text2">VNPAY</span>
            </div>
           
          </div>
        
        </div>
        <div className="checkout-page-column2">
          <div className="checkout-page-group1">
            <img
              src=""
              alt="img"
              className="checkout-page-img"
            />
            <div className="checkout-page-group2">
              <span className="checkout-page-tile">
                {checkoutData.eventName}
              </span>
              <span className="checkout-page-text-title-price checkout-page-price">{checkoutData.amount}</span>

            </div>
          </div>

          <div className="checkout-page-group3">
            <span className="checkout-page-text checkout-page-text-offers">Offers</span>
            <span className="checkout-page-text checkout-page-btn-add-code">Add Code</span>
          </div>
          <div className="checkout-page-group4">
            <span className="checkout-page-text checkout-page-text-detail">Payment Details</span>
            <div className="checkout-page-group5">
              {checkoutData.tickets &&
                checkoutData.tickets.map((ticket, index) => {
                  const total = ticket.price * ticket.quantity;
                  return (
                    <div key={index}>
                      <div className="checkout-page-group6">
                        <span className="checkout-page-text checkout-page-text-price">Price</span>
                        <span className="checkout-page-text checkout-page-text-price-detail">${ticket.price.toFixed(2)}</span>
                      </div>
                      <div className="checkout-page-group6">
                        <span className="checkout-page-text checkout-page-text-quality">Quantity</span>
                        <span className="checkout-page-text checkout-page-text-quality-detail">{ticket.quantity}</span>
                      </div>
                      <div className="checkout-page-group7">
                        <span className="checkout-page-text checkout-page-text-total">Total</span>
                        <span className="checkout-page-text checkout-page-text-total-detail">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="checkout-page-btn-pay">
            <a href="#" className="checkout-page-btn-pay">Pay Now</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
