import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SearchPage from "./pages/SearchPage";
import FoodDetails from "./pages/FoodDetails";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
       <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/signin" element={<SignIn />} />
   <Route path="/signup" element={<SignUp />} /> 
  <Route path="/search" element={<SearchPage />} />
  <Route path="/food/:id" element={<FoodDetails />} />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/profile" element={<ProfilePage />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;