import React, { useEffect, useState } from "react";
import axios from "axios";
import Categories from "../Categories/Categories";
import ProductCard from "../Product/ProductCard";
import { getProductQuantity } from "../../utils/cartUtils";
import styles from "./Home.module.css";
const Home = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [username, setUsername] = useState("");
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Fetch cart error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    // Fetch Products
    axios
      .get("/api/products/vendor")
      .then((response) => {
        setItems(response.data.vendorProducts || response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));

    // Get User Info
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    fetchCart();
  }, []);

  // Listen for Cart Updates across components
  useEffect(() => {
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading your experience...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeText}>
        Hi, {username ? username : "Guest"} 👋
      </h1>
      
      <h2 className={styles.sectionTitle}>Fresh Cuts (Base Products)</h2>
      
      <div className={styles.productGrid}>
        {items.map((item) => (
          <div key={item._id} className={styles.cardWrapper}>
            <ProductCard
              product={item}
              quantity={getProductQuantity(cart, item._id)}
            />
          </div>
        ))}
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "40px 0" }} />
      
      <Categories />
    </div>
  );
};

export default Home;