import React, { useState, useEffect, useRef } from "react";
import "./card.css";

const Card = ({ image, title, price, description, postId, onCardHidden }) => {
  const [showMore, setShowMore] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef(null);
  const descriptionRef = useRef(null);
  const [descriptionHeight, setDescriptionHeight] = useState("100px");

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/delete/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.ok) {
        setHidden(true);
        onCardHidden(postId);
      } else {
        alert(result.message || "Failed to delete the post.");
      }
    } catch (error) {
      alert("Failed to delete the post: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleShowMore = () => {
    if (showMore) {
      setDescriptionHeight("100px");
    } else {
      const fullHeight = descriptionRef.current.scrollHeight;
      setDescriptionHeight(`${fullHeight}px`);
    }
    setShowMore(!showMore);
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="post-card">
      <div className="post-header text-light bg-nav h-100 w-100">
        <div className="post-title text-center w-100 text-center">
          {imageLoaded ? (
            title
          ) : (
            <div className="skeleton-text skeleton-title"></div>
          )}
        </div>
        <div className="post-menu" ref={menuRef}>
          <button
            className="menu-btn text-light"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="menu-options">
              <button className="menu-item">Edit</button>
              <button
                className="menu-item"
                onClick={handleDelete}
                disabled={deleting}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-price text-dark text-center">
        {imageLoaded ? (
          `Price: ${price}`
        ) : (
          <div className="skeleton-text skeleton-price"></div>
        )}
      </div>

      <div className="post-description">
        {imageLoaded ? (
          <>
            <div
              ref={descriptionRef}
              className="description-content"
              style={{
                height: descriptionHeight,
                overflow: "hidden",
                transition: "height 0.5s ease",
              }}
              dangerouslySetInnerHTML={{
                __html: description.replace(/\n/g, "<br/>"),
              }}
            />
            {description.length > 100 && (
              <span className="see-more" onClick={toggleShowMore}>
                {showMore ? " See Less" : " ...See More"}
              </span>
            )}
          </>
        ) : (
          <div className="skeleton-text skeleton-description"></div>
        )}
      </div>

      <div className="post-image-container">
        {deleting ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div
              className="spinner-border text-danger"
              role="status"
              style={{ width: "2rem", height: "2rem" }}
            >
              <span className="visually-hidden">Deleting...</span>
            </div>
          </div>
        ) : (
          <>
            {!imageLoaded && <div className="skeleton-image"></div>}
            <img
              src={image}
              alt="Post"
              className={`post-image ${imageLoaded ? "visible" : "hidden"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
