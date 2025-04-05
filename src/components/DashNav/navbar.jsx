import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import Categories from "../../data/categories";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = ({ setLocation }) => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [locationFetched, setLocationFetched] = useState(false);
  const [retryingLocation, setRetryingLocation] = useState(false);
  const [permissionDeniedToastShown, setPermissionDeniedToastShown] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const locationTimeoutRef = useRef(null);

  const showToast = (success, message) => {
    const config = {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      newestOnTop: true,
    };
    success ? toast.success(message, config) : toast.error(message, config);
  };

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
    } catch (error) {
      showToast(false, "Error fetching location data.");
    }
  };

  const updateLocation = (latitude, longitude) => {
    setLocation?.({ latitude, longitude });
    localStorage.setItem(
      "userLocation",
      JSON.stringify({ latitude, longitude })
    );
    fetchCityAndCountry(latitude, longitude);
  };

  const areCoordinatesDifferent = (coord1, coord2) => {
    const threshold = 0.2;
    return (
      Math.abs(coord1.latitude - coord2.latitude) > threshold ||
      Math.abs(coord1.longitude - coord2.longitude) > threshold
    );
  };

  const getLocationFromBrowser = () => {
    setIsFetchingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const storedLocation = JSON.parse(
            localStorage.getItem("userLocation")
          );

          if (
            !storedLocation ||
            areCoordinatesDifferent(storedLocation, { latitude, longitude })
          ) {
            localStorage.setItem(
              "userLocation",
              JSON.stringify({ latitude, longitude })
            );
            setCity("");
            setCountry("");
            fetchCityAndCountry(latitude, longitude);
            setLocation?.({ latitude, longitude });
            setLocationFetched(true);
          } else {
            const storedCity = localStorage.getItem("city");
            const storedCountry = localStorage.getItem("country");

            if (!storedCity || !storedCountry) {
              fetchCityAndCountry(latitude, longitude);
            } else {
              setCity(storedCity);
              setCountry(storedCountry);
            }
            setLocationFetched(true);
          }
          setIsFetchingLocation(false);
        },
        (error) => {
          if (
            error.code === error.PERMISSION_DENIED &&
            !permissionDeniedToastShown
          ) {
            showToast(
              false,
              "Permission denied. Please allow location access."
            );
            setPermissionDeniedToastShown(true);
          }
          setCity("");
          setCountry("");
          setLocationFetched(true);
          setIsFetchingLocation(false);
        }
      );
    } else {
      showToast(false, "Geolocation is not supported by your browser.");
      setCity("No location");
      setCountry("");
      setLocationFetched(true);
      setIsFetchingLocation(false);
    }
  };

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

  useEffect(() => {
    getLocationFromBrowser();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedLocation = JSON.parse(localStorage.getItem("userLocation"));
    const storedCity = localStorage.getItem("city");
    const storedCountry = localStorage.getItem("country");

    if (storedLocation) {
      const { latitude, longitude } = storedLocation;

      if (
        !storedCity ||
        !storedCountry ||
        areCoordinatesDifferent(storedLocation, { latitude, longitude })
      ) {
        localStorage.setItem(
          "userLocation",
          JSON.stringify({ latitude, longitude })
        );
        fetchCityAndCountry(latitude, longitude);
      } else {
        setCity(storedCity);
        setCountry(storedCountry);
      }
      setLocationFetched(true);
    } else {
      getLocationFromBrowser();
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (city && country) {
      localStorage.setItem("city", city);
      localStorage.setItem("country", country);
    }
  }, [city, country]);

  const handleLocationHover = () => {
    if (!isMobile) setShowTooltip(true);
  };

  const handleLocationLeave = () => {
    if (!isMobile) setShowTooltip(false);
  };

  const handleLocationClick = () => {
    if (isMobile) setShowTooltip(!showTooltip);
  };

  useEffect(() => {
    if (isMobile && showTooltip) {
      setTimeout(() => setShowTooltip(false), 5000);
    }
  }, [isMobile, showTooltip]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm position-relative"
      style={{ zIndex: 5 }}
      >
        <div className="container-fluid m-0 p-0 justify-content-between">
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
                  <div
                    className="category col-lg-3 col-md-4 col-6"
                    key={i}
                  >
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

          <div className="d-flex align-items-center">
            <div
              className="position-relative me-2"
              onMouseEnter={handleLocationHover}
              onMouseLeave={handleLocationLeave}
              onClick={handleLocationClick}
              style={{ cursor: "pointer", zIndex: 5 }}
            >
              {city && country ? (
                <>
                  <i className="bi bi-geo-alt-fill text-success fs-4"></i>
                  {showTooltip && (
                    <div
                      className="position-absolute bg-light border rounded p-2"
                      style={{
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 5,
                      }}
                    >
                      <span className="text-dark">
                        {city}, {country}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={retryLocation}
                  className="btn btn-sm btn-danger"
                  disabled={retryingLocation || isFetchingLocation}
                >
                  {retryingLocation || isFetchingLocation ? (
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <i className="bi bi-geo-alt-fill"></i>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="dark"
        newestOnTop={true}
      />
    </>
  );
};

export default Navbar;
