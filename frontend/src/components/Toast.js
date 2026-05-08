import React from "react";
import "../styles/Toast.css";

function Toast({ message, show, type = "success" }) {
  if (!show) return null;

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </span>
      <span className="toast-text">{message}</span>
    </div>
  );
}

export default Toast;