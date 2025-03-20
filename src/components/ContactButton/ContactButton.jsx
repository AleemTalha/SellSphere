import React from "react";
import { NavLink } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import "./ContactButton.css";

const ContactButton = () => {
  return (
    <NavLink to="/contact" className="contact-button">
      <FaPhoneAlt className="contact-icon" />
    </NavLink>
  );
};

export default ContactButton;
