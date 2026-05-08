import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("userUpdated"));

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Welcome to Fluid 🍗</h2>
        <p>Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>
        </form>

        <p className="signup-text">
          New user?{" "}
          <span onClick={() => navigate("/signup")}>Create account</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;