import React, { useEffect } from "react";
import "./loading.css";

const Loading = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none"; 
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    };
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <h2 className="loading-text">
        Loading
        <span className="dot-l">.</span>
        <span className="dot-l">.</span>
        <span className="dot-l">.</span>
      </h2>
    </div>
  );
};

export default Loading;
