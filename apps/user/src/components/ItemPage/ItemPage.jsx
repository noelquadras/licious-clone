import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ItemPage.module.css";

const ItemPage = () => {
  const { id: productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/vendor/${productId}`);
        // Based on your console.log logic: response.data contains the vendorProduct
        setProductDetails(response.data.vendorProduct || response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  if (!productDetails) {
    return <div className={styles.container}><h2>Product not found.</h2></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        {/* Left Side: Image */}
        <div className={styles.imageSection}>
          <img 
            src={productDetails.image || "https://via.placeholder.com/400"} 
            alt={productDetails.name} 
            className={styles.productImage}
          />
        </div>

        {/* Right Side: Content */}
        <div className={styles.infoSection}>
          <p className={styles.category}>{productDetails.category}</p>
          <h1 className={styles.title}>{productDetails.name}</h1>
          <p className={styles.price}>₹{productDetails.price}</p>
          
          <div className={styles.description}>
            <h3>About this product</h3>
            <p>
              {productDetails.description || 
                "No description provided for this product."}
            </p>
          </div>

          <p><strong>Vendor:</strong> {productDetails.vendor?.storeName}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;