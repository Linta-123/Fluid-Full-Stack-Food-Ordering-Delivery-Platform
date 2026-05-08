import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FoodDetails.css";

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartToast, setShowCartToast] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/foods/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch food details");
        }
        return res.json();
      })
      .then((data) => setFood(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!food) return;

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = existingCart.find((item) => item.id === food.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        id: food.id,
        name: food.name,
        price: food.price,
        imageUrl: food.imageUrl,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setShowCartToast(false);

    setTimeout(() => {
      setShowCartToast(true);
    }, 10);

    setTimeout(() => {
      setShowCartToast(false);
    }, 2200);
  };

  if (!food) {
    return (
      <>
        <Navbar />
        <h2 className="loading-text">Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="food-details-page">
        <div className="food-details-card">
          <div className="image-wrapper">
            <img
              src={food.imageUrl}
              alt={food.name}
              className="food-image"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x300?text=Food+Image";
              }}
            />
            <button className="back-button" onClick={() => navigate(-1)}>
              ←
            </button>
          </div>

          <div className="food-content">
            <h1 className="food-title">{food.name}</h1>
            <p className="food-short-desc">{food.description}</p>
            <p className="food-long-desc">{food.longDescription}</p>

            <div className="price-row">
              <span className="new-price">₹{food.price}</span>
              <span className="old-price">₹{food.originalPrice}</span>
            </div>

            <p className="availability">
              {food.available ? "Available" : "Out of Stock"}
            </p>
          </div>
        </div>

        <div className="bottom-cart-bar">
          <div className="quantity-box">
            <button onClick={handleDecrease}>−</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>

          <button
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={!food.available}
          >
            {food.available
              ? `Add item ₹${food.price * quantity}`
              : "Out of Stock"}
          </button>
        </div>

        {showCartToast && (
          <div className="cart-toast" onClick={() => navigate("/cart")}>
            <div className="cart-toast-content">
              <div className="cart-toast-icon">✓</div>

              <div className="cart-toast-texts">
                <div className="cart-toast-title">Added to cart</div>
                <div className="cart-toast-subtitle">{food.name}</div>
              </div>

              <div className="cart-toast-action">View Cart</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FoodDetails;