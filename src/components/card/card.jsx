import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./card.css";

const Card = ({ imageUrl, title, price }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [textLoaded, setTextLoaded] = useState(false);

  return (
    <div className="card">
      <div className="image-container">
        {!imageLoaded && <div className="skeleton skeleton-image"></div>}
        <img
          src={imageUrl}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className={`card-img-top ${imageLoaded ? "d-block" : "d-none"}`}
        />
      </div>
      <div className="card-body">
        {!textLoaded && <div className="skeleton skeleton-text"></div>}
        <h5
          className={`card-title ${textLoaded ? "d-block" : "d-none"}`}
          onLoad={() => setTextLoaded(true)}
        >
          {title}
        </h5>
        <p
          className={`card-text ${textLoaded ? "d-block" : "d-none"}`}
          onLoad={() => setTextLoaded(true)}
        >
          ${price}
        </p>
      </div>
    </div>
  );
};

export default Card;
