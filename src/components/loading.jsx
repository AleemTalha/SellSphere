import React, { useEffect } from "react";
import "./loading.css";

const Loading = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none"; // Disable all pointer events
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto"; // Re-enable pointer events
    };
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <h2 className="loading-text">
        Loading
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </h2>
    </div>
  );
};

export default Loading;
