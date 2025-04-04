import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./navbar.css";

const showToastMessage = (success, message) => {
  toast[success ? "success" : "error"](message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    newestOnTop: true,
  });
};

const Navbar = ({ user, setUser }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    const cookies = document.cookie.split("; ");
    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    setUser(null);
    showToastMessage(true, "Logged out successfully");
    navigate("/login", { replace: true });
    setIsLoggingOut(false);
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
        <NavLink to="/" className="brand">
          <img src="/images/logo2.png" alt="logo" className="logo-2" />
        </NavLink>
        <div className="nav-links">
          {user ? (
            <div
              className={`user-menu ${dropdownOpen ? "open" : ""}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="user-info" onClick={toggleDropdown}>
                <span className="user-user-name">{user.fullname}</span>
                {!imageLoaded && <div className="user-skeleton-loader"></div>}
                <img
                  src={user.profileImage?.url || "/images/default.png"}
                  alt="Profile"
                  className={`user-image ${!imageLoaded ? "d-none" : ""}`}
                  onLoad={handleImageLoad}
                />
              </div>
              {dropdownOpen && (
                <div className="user-dropdown-content">
                  <NavLink
                    type="button"
                    to={`/profile/${user._id}`}
                    state={{ userId: user._id }}
                    className="btn text-dark user-dropdown-link text-black text-decoration-none"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="btn text-dark user-dropdown-link text-black text-decoration-none"
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
              )}
            </div>
          ) : (
            <div className="auth-links d-flex">
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="btn elong transition-all nav-link text-light text-decoration-none"
              >
                Login
              </button>
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
