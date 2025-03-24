import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row footer-container">
          <div className="col-12 col-md-4 col-lg-3 footer-section logo">
            <img
              src="/images/logo2.png"
              alt="Brand Logo"
              className="brand-logo"
            />
          </div>
          <div className="col-12 col-md-4 col-lg-3 footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
              <li>
                <NavLink to="/policy">Terms and Conditions</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4 col-lg-3 footer-section contact">
            <h4>Contact Us</h4>
            <p>
              Email: info@example.com
              <br />
              Phone: +123 456 7890
              <br />
              Address: 123 Street, City, Country
            </p>
          </div>
          <div className="col-12 col-md-4 col-lg-3 footer-section social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
