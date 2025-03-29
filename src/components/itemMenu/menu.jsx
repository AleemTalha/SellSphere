import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./menu.css";

const Menu = ({ category, phoneNumber }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const formattedPhoneNumber = phoneNumber?.replace(/^0/, "+92");

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`menu-container ${isMenuOpen ? "menu-container visible" : "menu-container"}`}
      onClick={toggleMenu}
    >
      <a
        href={`https://wa.me/${formattedPhoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="menu-item"
        title="Call the Seller"
      >
        <i className="bi bi-whatsapp text-light"></i>
      </a>

      <button className="menu-item" onClick={(e) => { e.stopPropagation(); navigate(-1); }} title="Go Back">
        <i className="bi bi-arrow-left text-light"></i>
      </button>

      <NavLink
        to={`/items/${category}`}
        className="menu-item"
        title="View More Items"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="bi bi-box text-light"></i>
      </NavLink>

      <NavLink
        to="/"
        className="menu-item"
        title="Go to Dashboard"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="bi bi-speedometer2 text-light"></i>
      </NavLink>
    </div>
  );
};

export default Menu;
