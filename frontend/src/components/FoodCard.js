import React from "react";
import { useNavigate } from "react-router-dom";

function FoodCard({ food }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/food/${food.id}`);
  };

  return (
    <div className="food-card">
      <img src={food.imageUrl} alt={food.name} />

      <h3>{food.name}</h3>
      <p>{food.description}</p>
      <h4>₹{food.price}</h4>

      <button onClick={handleClick}>
        View Item
      </button>
    </div>
  );
}

export default FoodCard;