import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // UPDATED URL based on your new guide
    axios.get('/api/products/base') 
      .then(response => {
        console.log("API Response:", response.data);
        // Handling the "baseProducts" wrapper you saw earlier
        setItems(response.data.baseProducts || response.data); 
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h2>Fresh Cuts (Base Products)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item._id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
             {/* If images exist and is an array, show the first one */}
             {item.images && item.images[0] && (
                <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
             )}
             <h3>{item.name}</h3>
             <p>{item.description}</p>
             <p style={{ fontWeight: 'bold', color: '#d92662' }}>₹{item.basePrice}</p>
             <button style={{ backgroundColor: '#d92662', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
               Add to Cart
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;