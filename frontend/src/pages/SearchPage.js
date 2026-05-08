import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/SearchPage.css";

function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/foods/search?keyword=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search foods");
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <Navbar />

      <div className="search-page">
        <div className="search-results">
          {!query.trim() ? (
            <p className="no-results"></p>
          ) : loading ? (
            <p className="no-results">Searching...</p>
          ) : results.length > 0 ? (
            results.map((food) => (
              <div
                key={food.id}
                className="search-item"
                onClick={() => navigate(`/food/${food.id}`)}
              >
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="search-item-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=Food";
                  }}
                />

                <div className="search-item-info">
                  <h3>{food.name}</h3>
                  <p>{food.category}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No foods found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;