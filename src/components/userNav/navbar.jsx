import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "./navbar.css";

const Navbar = ({ user, setUser }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

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
        toast.success("User has logged out successfully", { autoClose: 5000 });
        // navigate("/login");
      } else {
        toast.error(result.message || "Logout failed", { autoClose: 5000 });
      }
    } catch (error) {
      toast.error("Logout failed: " + error.message, { autoClose: 5000 });
    } finally {
      setIsLoggingOut(false);
    }
  };
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
      <NavLink to="/" className="brand">
        <img src="/images/logo2.png" alt="logo" className="logo-2" />
      </NavLink>
      <div className="nav-links">
        {user ? (
          <div className="user-menu">
            <div className="user-info">
              <img
                src={user.profileImage?.url || "/images/default.png"}
                alt="Profile"
                className="user-image"
              />
              <span className="user-name">{user.fullName}</span>
            </div>
            <div className="dropdown-content">
              <NavLink
                to={`/profile/${user._id}`}
                state = {{ userId: user._id }}
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
              className="btn btn-primary elong transition-all nav-link text-light text-decoration-none"
            >
              Login
            </NavLink>
            <NavLink
              to="/login"
              className="btn btn-secondary elong transition-all nav-link text-light text-decoration-none"
            >
              Signup
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
