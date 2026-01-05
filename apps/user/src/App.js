import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Categories from "./components/Categories";
import Stores from "./components/Stores";
import Profile from "./components/Profile";
import ItemPage from "./components/ItemPage";
import Checkout from "./components/Checkout";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ToastContainer />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/product/:id" element={<ItemPage/>} />
            <Route path="/checkout" element={<Checkout/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
