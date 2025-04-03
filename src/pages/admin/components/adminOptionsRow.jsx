import React from "react";
import { NavLink } from "react-router-dom";

const AdminOptionsRow = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Admin Dashboard</h2>
      <div className="row g-4">
        {/* Reports Box */}
        <div className="col-lg-3 col-md-6 col-12">
          <div
            className="card text-center shadow-lg border-0 rounded-3 hover-shadow"
            style={{ height: "100%" }}
          >
            <div
              className="card-body d-flex flex-column justify-content-between"
              style={{ height: "100%" }}
            >
              <h5 className="card-title text-primary mb-3">
                <i className="bi bi-flag-fill me-2"></i>Manage Reports
              </h5>
              <p className="card-text text-muted mb-4">
                Review and address user-submitted reports to ensure platform
                compliance and safety.
              </p>
              <NavLink
                to="/admin/report"
                className="text-decoration-none text-dark border border-2 btn-outline-primary w-100 py-2 rounded-pill mt-auto"
              >
                View Reports
              </NavLink>
            </div>
          </div>
        </div>

        {/* Applications Box */}
        <div className="col-lg-3 col-md-6 col-12">
          <div
            className="card text-center shadow-lg border-0 rounded-3 hover-shadow"
            style={{ height: "100%" }}
          >
            <div
              className="card-body d-flex flex-column justify-content-between"
              style={{ height: "100%" }}
            >
              <h5 className="card-title text-success mb-3">
                <i className="bi bi-file-earmark-check-fill me-2"></i>Manage
                Applications
              </h5>
              <p className="card-text text-muted mb-4">
                Approve or reject pending applications submitted by users for
                various services.
              </p>
              <NavLink
                to="/admin/applications"
                className="text-decoration-none text-dark border border-2 btn-outline-success w-100 py-2 rounded-pill mt-auto"
              >
                View Applications
              </NavLink>
            </div>
          </div>
        </div>

        {/* Users Box */}
        <div className="col-lg-3 col-md-6 col-12">
          <div
            className="card text-center shadow-lg border-0 rounded-3 hover-shadow"
            style={{ height: "100%" }}
          >
            <div
              className="card-body d-flex flex-column justify-content-between"
              style={{ height: "100%" }}
            >
              <h5 className="card-title text-warning mb-3">
                <i className="bi bi-people-fill me-2"></i>Manage Users
              </h5>
              <p className="card-text text-muted mb-4">
                View, edit, or delete user accounts and manage user roles and
                permissions.
              </p>
              <NavLink
                to="/admin/user"
                className="text-decoration-none text-dark border border-2 btn-outline-warning w-100 py-2 rounded-pill mt-auto"
              >
                Manage Users
              </NavLink>
            </div>
          </div>
        </div>

        {/* Ads Box */}
        <div className="col-lg-3 col-md-6 col-12">
          <div
            className="card text-center shadow-lg border-0 rounded-3 hover-shadow"
            style={{ height: "100%" }}
          >
            <div
              className="card-body d-flex flex-column justify-content-between"
              style={{ height: "100%" }}
            >
              <h5 className="card-title text-danger mb-3">
                <i className="bi bi-megaphone-fill me-2"></i>Manage
                Advertisements
              </h5>
              <p className="card-text text-muted mb-4">
                Approve, reject, or edit advertisements posted by users to
                maintain quality.
              </p>
              <NavLink
                to="/admin/ads"
                className="text-decoration-none text-dark border border-2  btn-outline-danger w-100 py-2 rounded-pill mt-auto"
              >
                Manage Ads
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOptionsRow;
