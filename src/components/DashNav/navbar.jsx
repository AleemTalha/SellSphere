import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import Categories from "../../data/categories";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slugify from "slugify";

const Navbar = ({ user, setLocation }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [locationFetched, setLocationFetched] = useState(false);
  const [retryingLocation, setRetryingLocation] = useState(false);
  const menuRef = useRef(null);
  const locationTimeoutRef = useRef(null);

  const showToast = (success, message) => {
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

  useEffect(() => {
    const fetchCityAndCountry = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${
            import.meta.env.VITE_GEO_API
          }`
        );
        const data = await response.json();
        setCity(data.city || data.locality || "");
        setCountry(data.countryName || "");
      } catch (error) {}
    };

    const updateLocation = (latitude, longitude) => {
      if (typeof setLocation === "function") {
        setLocation({ latitude, longitude });
      }
      localStorage.setItem(
        "userLocation",
        JSON.stringify({ latitude, longitude })
      );
      fetchCityAndCountry(latitude, longitude);
    };

    const getLocationFromBrowser = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation(latitude, longitude);
            setLocationFetched(true);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              showToast(
                "Permission denied. Please allow location access.",
                false
              );
            }
            setCity("");
            setCountry("");
            setLocationFetched(true);
          }
        );
      } else {
        showToast("Geolocation is not supported by your browser.", false);
        setCity("No location");
        setCountry("");
        setLocationFetched(true);
      }
    };

    if (!locationFetched) {
      const storedLocation = JSON.parse(localStorage.getItem("userLocation"));

      if (storedLocation) {
        const { latitude, longitude } = storedLocation;
        fetchCityAndCountry(latitude, longitude);
        setLocationFetched(true);
      } else if (user?.location?.coordinates?.length > 0) {
        const [longitude, latitude] = user.location.coordinates;
        updateLocation(latitude, longitude);
        setLocationFetched(true);
      } else {
        getLocationFromBrowser();
      }
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user, setLocation, locationFetched]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const retryLocation = () => {
    if (!retryingLocation) {
      setRetryingLocation(true);
      setCity("Fetching location...");
      setCountry("");
      getLocationFromBrowser();
      setTimeout(() => setRetryingLocation(false), 3000);
    }
  };

  const handleLocationClick = () => {
    setShowLocation(true);
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }
    locationTimeoutRef.current = setTimeout(() => {
      setShowLocation(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav
        className="navbar bg-light d-flex justify-content-between"
        style={{ zIndex: 1 }}
      >
        <div className="item-1" ref={menuRef}>
          <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <div className="transition-all">
                <span className="text-danger fw-bold">
                  Close Categories &nbsp;
                </span>
                <i className="bi bi-x-lg text-danger"></i>
              </div>
            ) : (
              <>
                <span className="text-success fw-bold">
                  Expand Categories &nbsp;
                </span>
                <i className="bi bi-chevron-down text-dark"></i>
              </>
            )}
          </div>

          <div className={`drop-down ${isOpen ? "show" : ""}`}>
            <div className="category-grid row text-start">
              {Categories.map((categoryData, i) => (
                <div className="category col-lg-3 col-md-4 col-6" key={i}>
                  <div className="category-title">
                    <NavLink
                      to={`/category/${slugify(categoryData.category)}`}
                      className="text-decoration-none category-title elong btn p-0 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {categoryData.category}
                    </NavLink>
                  </div>
                  <div className="category-items">
                    {categoryData.items.map((item, idx) => (
                      <div key={idx}>
                        <NavLink
                          to={`/category/${slugify(
                            categoryData.category
                          )}/${slugify(item)}`}
                          type="button"
                          className="text-decoration-none category-items elong p-0 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          {item}
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
  className="location-info"
  style={{ minHeight: "20px", maxHeight: "20px" }}
>
  {isMobile ? (
    <div className="position-relative">
      <i
        className={`bi ${
          city && country ? "bi-geo-alt-fill text-success" : "bi-geo-alt text-danger"
        } fs-4 cursor-pointer`}
        onClick={handleLocationClick}
      ></i>

      {showLocation && city && country && (
        <div
          className="dropdown-menu show position-absolute mt-1 p-2"
          style={{ zIndex: 999 }}
        >
          <span className="fw-bold text-nav">
            {city}, {country}
          </span>
        </div>
      )}
    </div>
  ) : city && country ? (
    <span className="fw-bold text-dark">
      {city}, {country}
    </span>
  ) : (
    !retryingLocation && (
      <button
        onClick={retryLocation}
        className="btn btn-danger py-0 px-2 m-0"
      >
        No Location
      </button>
    )
  )}
</div>

      </nav>
      <ToastContainer />
    </>
  );
};

export default Navbar;
