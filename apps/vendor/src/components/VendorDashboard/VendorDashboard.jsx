import React, { useEffect, useState } from "react";
import ProductCard from "../Product/ProductCard";
import styles from "./VendorDashboard.module.css";

const VendorDashboard = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading your experience...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeText}>
        Hi, {username ? username : "Guest Vendor"} 👋
      </h1>
      
      <h2 className={styles.sectionTitle}>My Products</h2>
      
      <div className={styles.productGrid}>
        {items.map((item) => (
          <div key={item._id} className={styles.cardWrapper}>
            <ProductCard
              product={item}
              // quantity={getProductQuantity(cart, item._id)}
            />
          </div>
        ))}
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "40px 0" }} />
    </div>
  );
};

export default VendorDashboard;