import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdminDashboard = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const showToast = (flag, message) => {
    toast(message, {
      type: flag ? "loading" : "error",
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    const API_URI = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URI}/admin/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          showToast(false, "Failed to fetch data. Going to Home page");
        }
        if (response.status === 403) {
          showToast(false, "Access denied. Redirecting to login...");
          navigate("/login");
        }
        setMessage(data.message);
        if (data.success && data.loggedIn) {
          setAdmin(data.user);
          showToast(true, data.user);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        showToast(false, "Failed to fetch data. Redirecting to login...");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (error) {
    return null;
  }
  return (
    <>
      <ToastContainer />
      <div>
        <nav className="navbar bg-nav px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-2 d-flex justify-content-between align-items-center">
          <NavLink to="/admin/dashboard">
            <img src="/images/logo2.png" alt="logo" className="logo-2" />
          </NavLink>
          {loading ? (
            <div className="admin-dropdown">
              <div className="admin-trigger">
                <SkeletonTheme baseColor="#e0e0e0" highlightColor="var(--bg-nav)">
                  <Skeleton width={100} height={20} className="skeleton-name" />
                  <Skeleton
                    circle
                    width={40}
                    height={40}
                    className="skeleton-avatar"
                  />
                </SkeletonTheme>
              </div>
            </div>
          ) : (
            admin && (
              <div
                className={`admin-dropdown ${dropdownOpen ? "open" : ""}`}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="admin-trigger" onClick={toggleDropdown}>
                  <span className="admin-name">{admin.fullname}</span>
                  <img
                    src={admin.profileImage?.url || "/images/default.png"}
                    alt="Admin Profile"
                    className="admin-avatar"
                  />
                </div>
                {dropdownOpen && (
                  <div className="admin-menu" style={{ zIndex: 10 }}>
                    <NavLink
                      type="button"
                      to={`/admin/profile/${admin._id}`}
                      state={{ adminId: admin._id }}
                      className="admin-item a-btn "
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => navigate("/login")}
                      className="admin-item a-btn"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </nav>

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
                    className="nav-link text-dark p-2 mx-2"
                    to="/admin/applications"
                    style={{ color: "black" }}
                  >
                    Applications
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link text-dark p-2 mx-2"
                    to="/admin/report"
                    style={{ color: "black" }}
                  >
                    Reports
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={{ color: "black" }}
                    className="nav-link text-dark p-2 mx-2"
                    to="/admin/user"
                  >
                    Users Accounts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={{ color: "black" }}
                    className="nav-link text-dark p-2 mx-2"
                    to="/admin/ads"
                  >
                    Advertisements
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminDashboard;
