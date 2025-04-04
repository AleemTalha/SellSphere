import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/dashCards/card";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const API_URI = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const endpoint = subcategory
          ? `/ads/${category}/${subcategory}`
          : `/ads/${category}`;
        const response = await fetch(`${API_URI}${endpoint}`);
        const result = await response.json();
        if (result.success) {
          setAds(result.ads);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [category, subcategory]);

  return (
    <div className="category-page-container">
      <h1>
        {subcategory
          ? `${subcategory.replace("-", " ")} in ${category.replace("-", " ")}`
          : `${category.replace("-", " ")}`}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : ads.length > 0 ? (
        <div className="d-card-wrapper">
          <div className="d-card-container">
            {ads.map((ad) => (
              <Card key={ad._id} ad={ad} />
            ))}
          </div>
        </div>
      ) : (
        <p>No ads available for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
