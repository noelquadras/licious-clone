import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.warning("Please login again", { position: "top-center" });
      navigate("/login");
      return;
    }

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

    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/cart", {
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
        toast.error("Failed to load Checkout", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
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
    <div style={{ maxWidth: "700px", margin: "30px auto" }}>
      <h1>Checkout</h1>

      {/* Order summary */}
      <div style={{ marginTop: "20px" }}>
        <h2>Order Summary</h2>

        {cart.items.map((item) => (
          <div
            key={item.vendorProduct._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
            }}
          >
            <div>
              <h4>{item.vendorProduct.baseProduct?.name || item.vendorProduct.name}</h4>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {item.vendorProduct.vendor?.storeName}
              </p>
              <p>Qty: {item.quantity}</p>
            </div>

            <div>₹{item.vendorProduct.price * item.quantity}</div>
          </div>
        ))}
      </div>

      <hr />

      <h2>
        Total: ₹
        {cart.items.reduce(
          (sum, item) => sum + item.vendorProduct.price * item.quantity,
          0
        )}
      </h2>

      <p>Delivery Address: {address ? `📍 ${address}` : "📍 Location not set"}</p>
      <p>type of payment</p>

      <button
        onClick={placeOrder}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          backgroundColor: "#d92662",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
