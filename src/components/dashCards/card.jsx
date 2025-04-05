import React, { useEffect, useState } from "react";
import "./card.css";
import { NavLink } from "react-router-dom";
import slugify from "slugify";

const Card = ({ ad }) => {
  const [locationInfo, setLocationInfo] = useState({
    city: "Fetching location...",
    country: "",
  });
  const [timeAgo, setTimeAgo] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        const [longitude, latitude] = ad.location.coordinates;
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        setLocationInfo({
          city: data.city || data.locality || "Unknown city",
          country: data.countryName || "Unknown country",
        });
      } catch (error) {
        setLocationInfo({
          city: "Error fetching location",
          country: "",
        });
      }
    };

    const calculateTimeAgo = () => {
      const adDate = new Date(ad.createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor((now - adDate) / 1000);

      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds} seconds ago`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)} minutes ago`);
      } else if (diffInSeconds < 86400) {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)} hours ago`);
      } else {
        setTimeAgo(`${Math.floor(diffInSeconds / 86400)} days ago`);
      }
    };

    fetchLocationInfo();
    calculateTimeAgo();
  }, [ad]);

  return (
    <div className="d-card">
      <div className="d-card-image-wrapper">
        {!isImageLoaded && <div className="skeleton skeleton-image"></div>}
        <img
          src={`${ad.image.url}?w=200&h=200&fit=cover&auto=format&f_auto&q=1&dpr=1`}
          alt={ad.title}
          className="d-card-image"
          onLoad={() => setIsImageLoaded(true)}
          style={{
            display: isImageLoaded ? "block" : "none",
            filter: isImageLoaded ? "none" : "blur(10px)",
            transition: "filter 0.2s ease-in-out",
          }}
        />
      </div>
      <div className="d-card-body">
        <h2 className="d-card-price">
          {!isImageLoaded ? (
            <div className="skeleton skeleton-price"></div>
          ) : (
            `Rs ${ad.price.toLocaleString()}`
          )}
        </h2>
        <h3 className="d-card-title">
          {!isImageLoaded ? (
            <div className="skeleton skeleton-title"></div>
          ) : ad.title.length > 15 ? (
            `${ad.title.slice(0, 20)}...`
          ) : (
            ad.title
          )}
        </h3>
        <div className="d-card-location">
          {!isImageLoaded ? (
            <div className="skeleton skeleton-location"></div>
          ) : (
            <>
              <i className="bi bi-geo-alt"></i>{" "}
              {`${locationInfo.city}, ${locationInfo.country}`}
            </>
          )}
        </div>
        <div className="d-card-time">
          {!isImageLoaded ? (
            <div className="skeleton skeleton-time"></div>
          ) : (
            timeAgo
          )}
        </div>
        <div className="d-flex justify-content-center align-items-center mt-2">
          {isImageLoaded ? (
            <NavLink
              type="button"
              className="rounded transition-all text-decoration-none btn-d-card mt-2 px-3 py-1 bg-transparent text-nav border border-dark border-2"
              to={`/item-id/${ad._id}/${slugify(ad.category, {
                lower: true,
              })}/`}
            >
              View Details
            </NavLink>
          ) : (
            <div
              className="skeleton skeleton-button"
              style={{
                width: "120px",
                height: "38px",
                borderRadius: "5px",
                backgroundColor: "var(--bg-nav)",
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
