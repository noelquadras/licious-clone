import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./ProductCard.module.css";
import QuantityButton from "./QuantityButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductCard = ({ product, quantity }) => {
  const navigate = useNavigate();

  const addToCart = async (vendorProductId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.info("Please log in to add items to your cart.", {
          position: "top-center",
        });
        navigate("/login");
        return;
      }

      await axios.post(
        "/api/cart/add",
        {
          vendorProductId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.info("Item added to cart!", {
        position: "top-center",
        closeOnClick: true,
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className={styles.card}>
      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className={styles.imageWrapper}>
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className={styles.image}
            />
          )}
        </div>
      </Link>
      <QuantityButton
        qty={quantity}
        onAdd={(qty) => addToCart(product._id)}
        onRemove={(qty) => {
          // later you can call remove-from-cart API
          // for now, just keep UI correct
        }}
      />

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.price}>
          ₹{product.price || product.basePrice || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
