import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./card.css";

const Card = ({ imageUrl, title, price }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => setImageLoaded(true);
    return () => {
      image.onload = null;
    };
  }, [imageUrl]);

  return (
    <div className="card">
      <div className="image-container">
        {!imageLoaded && <div className="skeleton skeleton-image"></div>}
        <img
          src={imageUrl}
          alt={title}
          className={`card-img-top ${imageLoaded ? "d-block" : "d-none"}`}
        />
      </div>
      <div className="card-body">
        {imageLoaded ? (
          <>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">${price}</p>
          </>
        ) : (
          <>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
