import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const getCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (!storedCart) return [];
      const parsed = JSON.parse(storedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const updateCartCount = () => {
    const cart = getCartFromStorage();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(total);
  };

  const loadUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(user);
  };

  useEffect(() => {
    updateCartCount();
    loadUser();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // keep navbar input synced with URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("query") || "";
    setSearchText(queryFromUrl);
  }, [location.search]);

  
const handleClickSearch = () => {
  // If user is on HOME → go to search page
  if (location.pathname === "/") {
    navigate("/search");
  }
};

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchText(value);

  if (location.pathname === "/search") {
    if (value.trim()) {
      navigate(`/search?query=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate("/search", { replace: true });
    }
  }
};

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        Fluid
      </div>

      <div className="search-form">
  <input
  type="text"
  placeholder="Search food..."
  className="search-bar"
  value={searchText}
  onClick={handleClickSearch}     // 🔥 click behavior
  onChange={handleSearchChange}   // 🔥 typing behavior
/>
      </div>

      {loggedInUser ? (
        <div className="profile-nav" onClick={() => navigate("/profile")}>
          {loggedInUser.name}
        </div>
      ) : (
        <button className="signin-btn" onClick={() => navigate("/signin")}>
          Sign In
        </button>
      )}

      <div className="cart-nav" onClick={() => navigate("/cart")}>
        Cart
        {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
      </div>
    </nav>
  );
}

export default Navbar;