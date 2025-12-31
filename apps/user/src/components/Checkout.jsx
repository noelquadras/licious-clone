import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.warning("Please login again", { position: "top-center" });
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get("api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data.cart || res.data.cart.items.length === 0) {
          toast.warning("Your Cart is Empty", { position: "top-center" });
          navigate("/cart");
          return;
        }

        setCart(res.data.cart);
      } catch (err) {
        toast.error("Failed to load Checkout", { positon: "top-center" });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const placeOrder = async () => {
    try {
      await axios.post(
        "/api/orders/place",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.info("Order placed successfully!", { position: "top-center" });
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed", {
        position: "top-center",
      });
    }
  };

  if (loading) return <h2>Loading...</h2>;
  return (
    <div>
      <h1>Checkout</h1>
      <h3>Total items: {cart.items.length}</h3>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;
