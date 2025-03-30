import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ReportButton from "../report/report";
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
    postedBy,
  } = ad;

  const [locationName, setLocationName] = useState("Fetching...");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [truncatedTitle, setTruncatedTitle] = useState(title);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 568);

  useEffect(() => {
    if (location?.coordinates) {
      const [longitude, latitude] = location.coordinates;
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
        .then((res) => res.json())
        .then((data) => {
          setLocationName(data.city || data.locality || "Unknown");
          setContentLoaded(true);
        })
        .catch(() => {
          setLocationName("Unknown");
          setContentLoaded(true);
        });
    } else {
      setContentLoaded(true);
    }
  }, [location]);

  useEffect(() => {
    const updateTitle = () => {
      if (window.innerWidth <= 576) {
        setTruncatedTitle(
          title.length > 10 ? title.substring(0, 10) + "..." : title
        );
      } else if (window.innerWidth <= 768) {
        setTruncatedTitle(
          title.length > 20 ? title.substring(0, 20) + "..." : title
        );
      } else {
        setTruncatedTitle(title);
      }
    };

    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 568);
    };

    updateTitle();
    window.addEventListener("resize", updateTitle);
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateTitle);
      window.removeEventListener("resize", updateScreenSize);
    };
  }, [title]);

  return (
    <div
      className={`mt-lg-5 mt-2 ad-card text-decoration-none text-dark ${
        isLargeScreen ? "large-screen" : "small-screen"
      }`}
    >
      <div className="c-item-img-con">
        {!imageLoaded && <div className="image-skeleton"></div>}
        <img
          src={image?.url}
          alt={title}
          className={`ad-image ${imageLoaded ? "loaded" : "hidden"}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="content-container">
        {!contentLoaded ? (
          <div className="text-skeleton">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text d-none d-md-block"></div>
            <div className="skeleton skeleton-text d-none d-md-block"></div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between">
              <h5 className="title text-center">{truncatedTitle}</h5>
              <ReportButton
                itemId={_id}
                title={truncatedTitle}
                type={category}
                postedBy={postedBy}
                text="⋮"
              />
            </div>
            <p className="location d-none d-md-block">
              <strong>Location:</strong> {locationName}
            </p>
            <p className="time-ago d-none d-md-block">
              {new Date(createdAt).toLocaleString()}
            </p>
            <p className="price">
              <strong>Rs. </strong> {price}/-
            </p>
            <p className="contact d-none d-md-block">
              <strong>Contact:</strong> {contactNumber}
            </p>
            <NavLink
              to={`/item-id/${_id}/${category}/`}
              className="view-details-btn bg-nav"
            >
              View Details
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
