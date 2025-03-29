import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-nav text-light py-4">
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-4 mb-3 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
            <NavLink to="/" className="d-flex align-items-center mb-2">
              <img src="/images/logo2.png" alt="logo" className="img-fluid" style={{ maxWidth: "150px" }} />
            </NavLink>
          </div>
          <div className="col-md-4 d-none d-lg-flex mb-3 mb-md-0 flex-column align-items-center align-items-md-start">
            <h5>Contact Us</h5>
            <p className="mb-1">Email: aleemtalha098@gmail.com</p>
            <p className="mb-1">Phone: +92 (327) 0445135</p>
            <p className="mb-0">Address: Shokat Town, Lahore, Pakistan</p>
          </div>
          <div className="col-md-4 d-flex flex-column align-items-center align-items-md-start">
            <h5>Quick Links</h5>
            <ul className="list-unstyled d-flex flex-lg-column flex-row gap-4 gap-lg-1">
              <li><NavLink to="/about" className="text-light text-decoration-underline" style={{textUnderlineOffset:"3px"}}>About Us</NavLink></li>
              <li><NavLink to="/contact" className="text-light text-decoration-underline" style={{textUnderlineOffset:"3px"}}>Contact</NavLink></li>
              <li><NavLink to="/policy" className="text-light text-decoration-underline" style={{textUnderlineOffset:"3px"}}>Privacy Policy</NavLink></li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} SellSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
