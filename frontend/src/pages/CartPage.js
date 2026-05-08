import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const getCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (!storedCart) return [];
      const parsed = JSON.parse(storedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse cart:", error);
      return [];
    }
  };

  useEffect(() => {
    setCart(getCartFromStorage());

    const handleCartUpdated = () => {
      setCart(getCartFromStorage());
    };

    const handleStorageChange = () => {
      setCart(getCartFromStorage());
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

const handleCheckout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const address = user?.address;

  if (!user) {
    alert("Please sign in to continue");
    navigate("/signin");
    return;
  }

  if (!address || !address.trim()) {
    alert("Please add your address to continue");
    navigate("/profile");
    return;
  }

  navigate("/payment");
};
  if (cart.length === 0) {
    return (
      <div>
        <Navbar />
        <h2 style={{ padding: "30px" }}>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <h1>Your Cart</h1>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              paddingBottom: "12px",
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <div style={{ flex: 1 }}>
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div>
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>

            <h4>₹{item.price * item.quantity}</h4>
          </div>
        ))}

        <h2>Total: ₹{totalPrice}</h2>

        <button
          onClick={handleCheckout}
          style={{
            width: "100%",
            padding: "14px",
            background: "#ef4b5f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Proceed to Payment
        </button>
        
      </div>
    </div>
  );
}

export default CartPage;