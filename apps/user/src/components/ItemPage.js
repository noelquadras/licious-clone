import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ItemPage = () => {
  const productId = useParams().id;
  const [productDetails, setProcudtDetails] = useState(null);

  useEffect (() => {
    // Fetch product details using productId
    const fetchproductDetails = async () => {
        try {
            const response = await axios.get(`/api/products/vendor/${productId}`);
            console.log("Product Details:", response.data);
            setProcudtDetails(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };
    fetchproductDetails();
  }, []);

  return (
  <div>
<h1>
    {productDetails ? productDetails.vendorProduct.name : "Loading..."}
</h1>
    </div>
    );
};

export default ItemPage;
