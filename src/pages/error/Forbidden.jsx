import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Forbidden = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="navbar d-flex justify-content-between navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
        <NavLink to="/" className="brand">
          <img src="/images/logo2.png" alt="logo" className="logo-2" />
        </NavLink>
        <div className="nav-links d-flex gap-4">
          <NavLink
            to="/"
            className="btn elong transition-all nav-link text-light text-decoration-none"
          >
            Home
          </NavLink>
        </div>
      </nav>

      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "calc(100vh - 56px)",
          backgroundColor: "#f8f9fa",
          textAlign: "center",
        }}
      >
        <h1 className="text-danger fw-bold mb-3">403 - Forbidden</h1>
        <p className="fs-5 mb-4">
          <span className="text-primary fw-bold">{role ? "Dear " + role + ", " : ""}</span>You
          are not allowed to access this route.
        </p>
        <div>
          <button className="btn btn-primary me-2 px-3 py-1 fs-5" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
