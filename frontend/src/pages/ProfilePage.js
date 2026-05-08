import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [orders, setOrders] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    setUser(storedUser);
    setAddress(storedUser?.address || "");
    setSavedAddress(storedUser?.address || "");
    setOrders(storedOrders);
  }, []);

  const handleSaveAddress = async () => {
    if (!address.trim()) {
      showToastMessage("Please enter address");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.id) {
      showToastMessage("Please sign in again");
      setTimeout(() => {
        navigate("/signin");
      }, 1200);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/users/${currentUser.id}/address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: address }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      const updatedUser = await response.json();

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSavedAddress(updatedUser.address || address);
      setAddress(updatedUser.address || address);

      window.dispatchEvent(new Event("userUpdated"));

      showToastMessage("Address saved successfully");
    } catch (error) {
      showToastMessage(error.message || "Failed to save address");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("address");

    setUser(null);
    setSavedAddress("");
    setAddress("");
    setOrders([]);

    window.dispatchEvent(new Event("userUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    showToastMessage("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToastMessage("Geolocation is not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location name");
          }

          const data = await response.json();
          const locationAddress = data.address || {};

          const area =
            locationAddress.suburb ||
            locationAddress.neighbourhood ||
            locationAddress.city_district ||
            locationAddress.village ||
            locationAddress.town ||
            "";

          const city =
            locationAddress.city ||
            locationAddress.town ||
            locationAddress.village ||
            locationAddress.county ||
            "";

          const state = locationAddress.state || "";

          let readableAddress = [area, city, state]
            .filter(Boolean)
            .join(", ");

          if (!readableAddress) {
            readableAddress = data.display_name || `Lat: ${lat}, Lng: ${lng}`;
          }

          setAddress(readableAddress);
          showToastMessage("Location fetched successfully");
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setAddress(`Lat: ${lat}, Lng: ${lng}`);
          showToastMessage("Could not convert location name, raw coordinates used");
        }
      },
      (error) => {
        if (error.code === 1) {
          showToastMessage("Location permission denied");
        } else if (error.code === 2) {
          showToastMessage("Location unavailable");
        } else if (error.code === 3) {
          showToastMessage("Location request timed out");
        } else {
          showToastMessage("Unable to fetch current location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "30px", textAlign: "center" }}>
          <h2>Please sign in first</h2>
        </div>
        <Toast message={toastMessage} show={showToast} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          background: "#fff",
          padding: "24px",
          borderRadius: "14px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "24px" }}>My Profile</h1>

        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ marginBottom: "12px" }}>Personal Details</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ marginBottom: "12px" }}>My Address</h2>

          <textarea
            rows="4"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              resize: "none",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              onClick={handleUseCurrentLocation}
              style={{
                background: "#444",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Use Current Location
            </button>

            <button
              onClick={handleSaveAddress}
              style={{
                background: "#ef4b5f",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Save Address
            </button>
          </div>

          {savedAddress && (
            <p style={{ marginTop: "14px", color: "#333" }}>
              <strong>Saved Address:</strong> {savedAddress}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ marginBottom: "12px" }}>My Orders</h2>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "12px",
                }}
              >
                <p>
                  <strong>Order #{index + 1}</strong>
                </p>
                <p>
                  <strong>Date:</strong> {order.date}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.total}
                </p>
                <p>
                  <strong>Items:</strong> {order.items.length}
                </p>

                {order.items.map((item, i) => (
                  <p key={i} style={{ marginLeft: "10px", color: "#555" }}>
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#111",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Logout
        </button>
      </div>

      <Toast message={toastMessage} show={showToast} />
    </div>
  );
}

export default ProfilePage;