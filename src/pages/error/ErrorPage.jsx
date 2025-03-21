import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../../components/loginNav/navbar";
import "./ErrorPage.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="error-page">
        <div className="error-content">
          <h1 className="error-title">404</h1>
          <p className="error-message">
            Oops! The page you are looking for does not exist.
          </p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <NavLink to="/" className="btn btn-secondary">
            Home
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
