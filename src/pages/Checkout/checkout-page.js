import React from 'react'
import "../Checkout/checkout-page.css"
import { useState } from "react";
import { motion } from "framer-motion";
const CheckoutPage = (props) => {
  const [selected, setSelected] = useState("option5");
  const [isOption2Expanded, setIsOption2Expanded] = useState(false);
  return (
    <div className="checkout-page-container">
      <div className="checkout-page-checkout-page">
        <div className="checkout-page-column1">
          <span className="checkout-page-text-title">Payment Method</span>

          <div className="checkout__option1">
            <span className=" checkout-page-text checkout__option-text1">Google Pay</span>
            <i className="checkout__option-icon bi bi-chevron-right"></i>
          </div>

          {/* Nhấn để mở hoặc đóng */}
          <div className="checkout__option2" onClick={() => setIsOption2Expanded(!isOption2Expanded)}>
            <span className="checkout-page-text checkout__option-text2">Debit Card</span>
            <i className={`bi ${isOption2Expanded ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
          </div>
          <motion.div
            className="checkout__option3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isOption2Expanded ? "auto" : 0, opacity: isOption2Expanded ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="checkout__option5" onClick={() => setSelected("option5")}>
              <div>
                <img className="master-card" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width="25" />
                <span className="checkout-page-text checkout__option-text5">Axim Bank</span>
              </div>
              <input type="radio" className="option" checked={selected === "option5"} readOnly />
            </div>

            <div className="checkout__option6" onClick={() => setSelected("option6")}>
              <div>
                <img className="visa" src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" width="25" />
                <span className="checkout-page-text checkout__option-text6">HDFC Bank</span>
              </div>
              <input type="radio" className="option" checked={selected === "option6"} readOnly />
            </div>
            <div className="checkout__option4">
              <i class="bi bi-plus-circle"></i>
              <span className="checkout-page-text checkout__option-text4">Add New Cards</span>
            </div>
          </motion.div>
        
          <div className="checkout__option7">
            <i class="bi bi-plus-circle"></i>
            <span className="checkout-page-text checkout__option-text7">Add New Method</span>
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
                She Is Women's Conference 2025 - BLOOM
              </span>
              <span className="checkout-page-text-title-price checkout-page-price">$66.00</span>
            </div>
          </div>

          <div className="checkout-page-group3">
            <span className="checkout-page-text checkout-page-text-offers">Offers</span>
            <span className="checkout-page-text checkout-page-btn-add-code">Add Code</span>
          </div>
          <div className="checkout-page-group4">
            <span className="checkout-page-text checkout-page-text-detail">Payment Details</span>
            <div className="checkout-page-group5">
              <div className="checkout-page-group6">
                <span className="checkout-page-text checkout-page-text-price">Price</span>
                <span className="checkout-page-text checkout-page-text-price-detail">$66.00</span>
              </div>
              <div className="checkout-page-group6">
                <span className="checkout-page-text checkout-page-text-quality">Quantity</span>
                <span className="checkout-page-text checkout-page-text-quality-detail">1</span>
              </div>
              <div className="checkout-page-group7">
                <span className="checkout-page-text checkout-page-text-total">Total</span>
                <span className="checkout-page-text checkout-page-text-total-detail">$66.00</span>
              </div>
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
