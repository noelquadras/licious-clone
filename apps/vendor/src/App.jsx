import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";
import VendorDashboard from "./components/VendorDashboard/VendorDashboard"
import Profile from "./components/Profile/Profile";
import ItemPage from "./components/ItemPage/ItemPage";
import LoginSidebar from "./components/Login/LoginSidebar";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar onLoginClick={() => setLoginOpen(true)}/>
        <LoginSidebar
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
        />
        <ToastContainer />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<VendorDashboard />} />
            <Route path="/register" element={<Register onLoginClick={() => setLoginOpen(true)} />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/product/:id" element={<ItemPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
