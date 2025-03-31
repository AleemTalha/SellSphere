import React from "react";
import Navbar from "../../../components/userNav/navbar";
import { NavLink } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import "./About.css";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="about-container">
          <h1>About Us</h1>
          <p>
            Welcome to our platform! We are committed to providing a seamless,
            secure, and user-friendly experience for online transactions. Our
            goal is to create a marketplace that is efficient, reliable, and
            accessible to everyone.
          </p>

          <h2>Our Vision</h2>
          <p>
            We aim to revolutionize the way people buy and sell products online.
            Our vision is to create a trusted and transparent marketplace where
            users can connect, trade, and interact effortlessly. We believe in
            empowering individuals by providing tools that enhance their buying
            and selling experience.
          </p>

          <h2>How Our Platform Works</h2>
          <p>
            Our platform is designed to be user-friendly, efficient, and secure.
            Whether you're a seller looking to showcase your products or a buyer
            searching for the best deals, we’ve got you covered.
          </p>
          <ul>
            <li>
              <strong>Easy Registration:</strong> Create an account quickly and
              securely.
            </li>
            <li>
              <strong>Post & Manage Ads:</strong> Upload images, write detailed
              descriptions, and set pricing.
            </li>
            <li>
              <strong>Browse & Search:</strong> Explore various categories and
              use filters to find exactly what you need.
            </li>
            <li>
              <strong>Secure Transactions:</strong> Verified payment methods for
              safe buying and selling.
            </li>
            <li>
              <strong>Direct Communication:</strong> Message sellers or leave
              comments for inquiries.
            </li>
          </ul>

          <h2>Why Choose Us?</h2>
          <p>Here’s why users love our platform:</p>
          <ul>
            <li>✅ User-friendly and intuitive design</li>
            <li>✅ Secure transactions with fraud protection</li>
            <li>✅ Large community of trusted buyers and sellers</li>
            <li>✅ 24/7 customer support for any assistance</li>
            <li>✅ Fast and smooth user experience</li>
          </ul>

          <h2>Security and Privacy</h2>
          <p>
            We take user security seriously. Our platform is built with advanced
            encryption and data protection protocols to safeguard user
            information. We also have strict community guidelines to ensure a
            safe and respectful environment for everyone.
          </p>

          <h2>Customer Support</h2>
          <p>
            Need help? Our dedicated support team is here to assist you with any
            queries, technical issues, or concerns. You can reach out to us via:
          </p>
          <p>
            <strong>Email:</strong> support@example.com
            <br />
            <strong>Phone:</strong> +123 456 7890
            <br />
            <strong>Address:</strong> 123 Street, City, Country
          </p>

          <h2>Join Our Community</h2>
          <p>
            Become a part of our growing marketplace today. Sign up now and
            enjoy a seamless and secure online shopping experience!
          </p>
          <div className="d-flex justify-content-center">
            <NavLink
              to="/login"
              type="button"
              className="text-center btn elong transition-all px-4 py-2 rounded-2 about-sign"
            >
              SignUp
            </NavLink>
          </div>
        </div>
      </div>
      <div className="about-footer">
        <Footer />
      </div>
    </>
  );
};

export default About;
