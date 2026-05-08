import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function BannerSlider() {
  const navigate = useNavigate();

  return (
    <div className="banner-slider">
      <div className="banner-card" onClick={() => navigate("/food/1")}>
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
          alt="Banner Food"
        />
        <div className="banner-text">Hot Deals at Fluid</div>
      </div>
    </div>
  );
}

export default BannerSlider;