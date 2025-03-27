import React, { useState, useEffect, useRef } from "react";
import "./card.css";

const Card = ({ image, title, price, description }) => {
  const [showMore, setShowMore] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="post-card">
      <div className="post-header">
        <p className="post-title">
          {imageLoaded ? title : <div className="skeleton-text skeleton-title"></div>}
        </p>
        <div className="post-menu" ref={menuRef}>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
          {menuOpen && (
            <div className="menu-options">
              <button className="menu-item">Edit</button>
              <button className="menu-item">Delete</button>
              <button className="menu-item">Share</button>
            </div>
          )}
        </div>
      </div>

      <p className="post-price">
        {imageLoaded ? `Price: ${price}` : <div className="skeleton-text skeleton-price"></div>}
      </p>

      <div className="post-image-container">
        {!imageLoaded && <div className="skeleton-image"></div>}
        <img 
          src={image} 
          alt="Post" 
          className={`post-image ${imageLoaded ? "visible" : "hidden"}`} 
          onLoad={() => setImageLoaded(true)} 
        />
      </div>

      <p className="post-description">
        {imageLoaded ? (
          <>
            {showMore ? description : description.slice(0, 100)}
            {description.length > 100 && (
              <span className="see-more" onClick={() => setShowMore(!showMore)}>
                {showMore ? " See Less" : " ...See More"}
              </span>
            )}
          </>
        ) : (
          <div className="skeleton-text skeleton-description"></div>
        )}
      </p>
    </div>
  );
};

export default Card;
