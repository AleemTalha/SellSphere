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
          <button className="btn bg-nav text-light elong transition-all border border-2 px-3 py-2 fs-5 rounded-3 mx-3" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <NavLink to="/" className="bg-nav text-light elong transition-all border border-2 px-3 py-2 fs-5 rounded-3 mx-3 btn">
            Home
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
