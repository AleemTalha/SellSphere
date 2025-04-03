import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminOptionsRow from "./components/adminOptionsRow";
import Navbar from "./components/navbar/navbar";

const AdminDashboard = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const carouselTexts = [
    "Track and oversee user activities with precision to ensure a safe and secure platform for all users. Monitor trends, identify issues, and take proactive measures to maintain platform integrity.",
    "Generate insightful and detailed reports to make data-driven decisions. Analyze user behavior, platform performance, and key metrics to optimize your strategies and achieve your goals effectively.",
    "Optimize your platform's growth with targeted advertisements. Manage ad campaigns effectively, approve or reject ads, and ensure they align with your platform's standards and policies seamlessly.",
    "Streamline the management of user accounts and applications. Approve or reject user requests, assign roles, and maintain a seamless user experience across the platform with ease and efficiency.",
    "Stay ahead with real-time updates and notifications. Keep track of important events, user activities, and system alerts to ensure smooth operations and quick responses for better outcomes.",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fade, setFade] = useState(false);

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

  const handleLogout = async () => {
    const logoutUrl = `${import.meta.env.VITE_API_URL}/logout`;
    setIsLoggingOut(true);

    try {
      const response = await fetch(logoutUrl, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Logged out successfully");
        setTimeout(() => {
          navigate("/login", { replace: true }); // Ensure direct navigation to login
        }, 500);
      } else {
        toast.error(data.message || "Failed to log out");
      }
    } catch (error) {
      toast.error("An error occurred while logging out");
    } finally {
      setIsLoggingOut(false);
    }
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

  useEffect(() => {
    document.title = "SellSphere - Admin Dashboard";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentTextIndex(
          (prevIndex) => (prevIndex + 1) % carouselTexts.length
        );
        setFade(false);
      }, 500); 
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
                <SkeletonTheme
                  baseColor="#e0e0e0"
                  highlightColor="var(--bg-nav)"
                >
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
                    src={
                      isLoggingOut
                        ? "/images/loading-spinner.gif"
                        : admin.profileImage?.url || "/images/default.png"
                    }
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
                      className="admin-item a-btn text-decoration-none "
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="admin-item a-btn"
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </nav>

        <Navbar />

        <div
          className="text-carousel-container d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "50vh", backgroundColor: "#f9f9f9" }}
        >
          <h2 className="text-carousel-heading mb-3">
            Welcome to Your Admin Dashboard
          </h2>
          <p
            className={`text-carousel-paragraph text-center mb-4 ${
              fade ? "fade-out" : "fade-in"
            }`}
          >
            {carouselTexts[currentTextIndex]}
          </p>
        </div>

        <AdminOptionsRow />
      </div>
    </>
  );
};

export default AdminDashboard;
