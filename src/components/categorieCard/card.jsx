import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./card.css";

const Card = ({ ad }) => {
  const {
    _id,
    title,
    location,
    createdAt,
    category,
    image,
    price,
    contactNumber,
  } = ad;
  const [locationName, setLocationName] = useState("Fetching...");

  useEffect(() => {
    if (location?.coordinates) {
      const [longitude, latitude] = location.coordinates;
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
        .then((res) => res.json())
        .then((data) => {
          setLocationName(data.city || data.locality || "Unknown");
        })
        .catch(() => setLocationName("Unknown"));
    }
  }, [location]);

  const renderExtraFields = () => {
    if (category === "Cars") {
      return (
        <div className="extra-info d-none d-md-block">
          <p>
            <strong>Make:</strong> {ad.Make}
          </p>
          <p>
            <strong>Model:</strong> {ad.Model}
          </p>
          <p>
            <strong>Year:</strong> {ad.Year}
          </p>
        </div>
      );
    } else if (category === "Houses") {
      return (
        <div className="extra-info d-none d-md-block">
          <p>
            <strong>Rooms:</strong> {ad.bedrooms}
          </p>
          <p>
            <strong>Area:</strong> {ad.area}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <NavLink
      to={`/item-id/${_id}/${category}/`}
      className="ad-card text-decoration-none text-dark"
    >
      <div className="image-container">
        <img src={image?.url} alt={title} className="ad-image" />
      </div>
      <div className="content-container">
        <h5 className="title">{title}</h5>
        <p className="location">
          <strong>Location:</strong> {locationName}
        </p>
        <p className="time-ago">{new Date(createdAt).toLocaleString()}</p>
        {renderExtraFields()}
        <p className="price">
          <strong>Price:</strong> ${price}
        </p>
        <p className="contact">
          <strong>Contact:</strong> {contactNumber}
        </p>
        <NavLink
          to={`/item-id/${_id}/${category}/`}
          className="view-details-btn text-dark"
        >
          View Details
        </NavLink>
      </div>
    </NavLink>
  );
};

export default Card;
