import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BannerSlider from "../components/BannerSlider";
import FoodCard from "../components/FoodCard";
import "../styles/Home.css";

function Home() {
  const [foods, setFoods] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchFoods();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.address) {
      setAddress(user.address);
    } else {
      setAddress("");
    }

    const handleUserUpdated = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (updatedUser && updatedUser.address) {
        setAddress(updatedUser.address);
      } else {
        setAddress("");
      }
    };

    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch("http://localhost:8080/foods");
      if (!response.ok) {
        throw new Error("Failed to fetch foods");
      }
      const data = await response.json();
      setFoods(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="home-location-bar">
        <span className="location-icon">📍</span>
        {address ? (
          <span className="home-location-text">{address}</span>
        ) : (
          <span
            className="home-location-link"
            onClick={() => (window.location.href = "/profile")}
          >
            Set your location
          </span>
        )}
      </div>

      <BannerSlider />

      <section className="hotel-section">
        <h1>Fluid</h1>
        <p>Delicious food delivered hot and fast</p>
      </section>

      <section className="food-list">
        <h2>Popular Items</h2>
        <div className="food-grid">
          {foods.slice(0, 9).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;