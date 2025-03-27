import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./navbar.css";

const showToastMessage = (success, message) => {
  if (success) {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      newestOnTop: true,
    });
  } else {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      newestOnTop: true,
    });
  }
};

const Navbar = ({ user, setUser }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`http://localhost:3000/logout`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setUser(null);
        showToastMessage(true, "Logged out successfully");
      } else {
        showToastMessage(false, result.message || "Logout failed");
      }
    } catch (error) {
      showToastMessage(false, "Logout failed: " + error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
    <ToastContainer/>
    <nav className="navbar navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
      <NavLink to="/" className="brand">
        <img src="/images/logo2.png" alt="logo" className="logo-2" />
      </NavLink>
      <div className="nav-links">
        {user ? (
          <div className="user-menu">
            <div className="user-info">
              {loading ? (
                <>
                  <div className="skeleton-image"></div>
                </>
              ) : (
                <>
                  <img
                    src={user.profileImage?.url || "/images/default.png"}
                    alt="Profile"
                    className="user-image"
                  />
                  <span className="user-name">{user.fullName}</span>
                </>
              )}
            </div>
            <div className="dropdown-content">
              <NavLink
                to={`/profile/${user._id}`}
                state={{ userId: user._id }}
                className="dropdown-link nav-link text-black text-decoration-none"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="dropdown-link nav-link text-black text-decoration-none"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                      style={{ color: "#ffcc00" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-links d-flex">
            <NavLink
              to="/login"
              className="btn elong transition-all nav-link text-light text-decoration-none"
            >
              Login
            </NavLink>
            <NavLink
              to="/login"
              className="btn elong transition-all nav-link text-light text-decoration-none"
            >
              Signup
            </NavLink>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
