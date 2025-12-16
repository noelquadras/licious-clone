import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LocationModal from "./LocationModal";
import LocationSearchInput from "./LocationSearchInput";

const Navbar = () => {
  const [address, setAddress] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAddress(res.data.user.address || "");
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserProfile();
  }, []);

  // 👇 HANDLE ADDRESS CHANGE
  const handleChange = async () => {
    const newAddress = prompt("Enter your delivery address:");

    if (!newAddress) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "/api/users/location",
        {
          address: newAddress,
          // latitude & longitude optional
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddress(res.data.user.address);
      alert("Location updated successfully!");
    } catch (error) {
      console.error(
        "Update location error:",
        error.response?.data || error.message
      );
      alert("Failed to update location");
    }
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    alignItems: "center",
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo + Location */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#d92662",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Licious Clone
          </Link>

          <button
            onClick={() => setShowLocationModal(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: "0.85rem",
              color: "#555",
              textAlign: "left",
            }}
          >
            {address ? `📍 ${address}` : "📍 Location not set"}
          </button>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#333" }}>
            Base Products
          </Link>
          <Link to="/cart" style={{ textDecoration: "none", color: "#333" }}>
            Cart
          </Link>
          <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>
            Login
          </Link>
          <Link to="/register" style={{ textDecoration: "none", color: "#333" }}>
            Register
          </Link>
        </div>
      </nav>

      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
          onSave={(newAddress) => setAddress(newAddress)}
        />
      )}
    </>
  );
};

export default Navbar;