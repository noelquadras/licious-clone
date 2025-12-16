import React from 'react';
import axios from 'axios';

const Cart = () => {
  const username = localStorage.getItem("username") || "Guest";
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get ("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart Items:", res.data);
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data || error.message);
    };
  };
  return (
    <div>
      <h1>{username}'s Cart</h1>
      <p>cart items:
        <button onClick={fetchCartItems}></button>
      </p>
    </div>
  );
};

export default Cart;