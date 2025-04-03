import React from "react";
import { NavLink } from "react-router-dom";

const navbar = () => {
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg d-flex justify-content-end"
        style={{ backgroundColor: "#f2f2f2", zIndex: 1 }}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="container-fluid justify-content-center justify-content-lg-between">
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <NavLink
                  className="nav-link admin-dash-navlink text-dark p-2 mx-2 text-decoration-none"
                  to="/admin/applications"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: "rgba(0, 130, 54, 0.39)",
                          borderRadius: "5px",
                        }
                      : {}
                  }
                >
                  Applications
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link admin-dash-navlink text-dark p-2 mx-2 text-decoration-none"
                  to="/admin/reports"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: "rgba(0, 130, 54, 0.39)",
                          borderRadius: "5px",
                        }
                      : {}
                  }
                >
                  Reports
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link admin-dash-navlink text-dark p-2 mx-2 text-decoration-none"
                  to="/admin/users"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: "rgba(0, 130, 54, 0.39)",
                          borderRadius: "5px",
                        }
                      : {}
                  }
                >
                  Users Accounts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link admin-dash-navlink text-dark p-2 mx-2 text-decoration-none"
                  to="/admin/ads"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: "rgba(0, 130, 54, 0.39)",
                          borderRadius: "5px",
                        }
                      : {}
                  }
                >
                  Advertisements
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default navbar;
