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
        {!imageLoaded && (
          <div
            className="skeleton-loader"
            style={{
              width: "100%",
              height: "100%",
            }}
          ></div>
        )}
        <img
          src={`${image?.url}?w=50&h=50&fit=cover&auto=format&q=1&dpr=1`}
          alt={title}
          className={`ad-image ${imageLoaded ? "loaded" : "hidden"}`}
          onLoad={() => setImageLoaded(true)}
          style={{
            display: imageLoaded ? "block" : "none",
            transition: "opacity 0.3s ease-in-out",
            opacity: imageLoaded ? 1 : 0,
          }}
        />
      </div>

      <div className="content-container">
        {!contentLoaded ? (
          <div>
            <div
              className="skeleton-loader"
              style={{
                width: "70%",
                height: "1.5rem",
                marginBottom: "0.5rem",
              }}
            ></div>
            <div
              className="skeleton-loader"
              style={{
                width: "90%",
                height: "1rem",
                marginBottom: "0.5rem",
              }}
            ></div>
            <div
              className="skeleton-loader d-none d-md-block"
              style={{
                width: "60%",
                height: "1rem",
                marginBottom: "0.5rem",
              }}
            ></div>
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
            <div className="d-flex justify-content-between align-items-center d-none d-md-flex">
              <p className="location mb-0">
                <strong>
                  <i className="bi bi-geo-alt"></i>
                </strong>{" "}
                {locationName}
              </p>
              <p className="time-ago mb-0">
                {(() => {
                  const now = new Date();
                  const diff = Math.floor((now - new Date(createdAt)) / 1000);
                  if (diff < 60) return `${diff} seconds ago`;
                  if (diff < 3600)
                    return `${Math.floor(diff / 60)} minutes ago`;
                  if (diff < 86400)
                    return `${Math.floor(diff / 3600)} hours ago`;
                  return `${Math.floor(diff / 86400)} days ago`;
                })()}
              </p>
            </div>

            <p className="price">
              <strong>
                <i className="bi bi-currency-rupee"></i>
              </strong>{" "}
              {price}/-
            </p>
            <p className="contact d-none d-md-block">
              <strong>
                <i className="bi bi-telephone"></i>
              </strong>{" "}
              {contactNumber}
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
