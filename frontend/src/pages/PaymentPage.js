import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

function PaymentPage() {
  const [method, setMethod] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const navigate = useNavigate();

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePayment = () => {
    if (!method) {
      showToastMessage("Please select payment method", "error");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const order = {
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod: method,
      date: new Date().toLocaleString()
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));

    showToastMessage("Payment successful", "success");

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Select Payment Method</h2>

        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "12px" }}>
            <input
              type="radio"
              name="payment"
              value="COD"
              onChange={(e) => setMethod(e.target.value)}
              style={{ marginRight: "8px" }}
            />
            Cash on Delivery
          </label>

          <label style={{ display: "block", marginBottom: "12px" }}>
            <input
              type="radio"
              name="payment"
              value="ONLINE"
              onChange={(e) => setMethod(e.target.value)}
              style={{ marginRight: "8px" }}
            />
            Online Payment
          </label>
        </div>

        <button
          onClick={handlePayment}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            background: "#ef4b5f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Pay Now
        </button>
      </div>

      <Toast message={toastMessage} show={showToast} type={toastType} />
    </>
  );
}

export default PaymentPage;