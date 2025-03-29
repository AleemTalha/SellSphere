import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ItemDetails = () => {
  const { id, category } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const API_URI = (import.meta.env.VITE_API_URL + `/dashboard/items/${id}`) || "http://localhost:3000";
        console.log("API URI:", API_URI);
        const response = await fetch(`${API_URI}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item data");
        }
        const data = await response.json();
        setItemData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{itemData.title}</h1>
      <img src={itemData.image.url} alt={itemData.title} />
      <p>Price: Rs {itemData.price.toLocaleString()}</p>
      <p>Description: {itemData.description}</p>
      <p>
        Location: {itemData.location.city}, {itemData.location.country}
      </p>
      <p>Category: {category}</p> {/* Display the slugified category */}
    </div>
  );
};

export default ItemDetails;
