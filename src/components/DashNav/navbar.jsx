import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Categories from "../../data/categories";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ user, setLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    const fetchCityAndCountry = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        setCity(data.city || data.locality || "Unknown location");
        setCountry(data.countryName || "Unknown country");
      } catch (error) {
        console.error("Failed to fetch city and country: " + error.message);
      }
    };

    const updateLocation = (latitude, longitude) => {
      setLocation({ latitude, longitude });
      localStorage.setItem("userLocation", JSON.stringify({ latitude, longitude }));
      fetchCityAndCountry(latitude, longitude);
    };

    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
      }
    };

    const storedLocation = JSON.parse(localStorage.getItem("userLocation"));

    if (user?.location?.coordinates?.length > 0) {
      const [longitude, latitude] = user.location.coordinates;
      fetchCityAndCountry(latitude, longitude);
    } else if (storedLocation) {
      const { latitude, longitude } = storedLocation;
      fetchCityAndCountry(latitude, longitude);
    } else {
      getLocation();
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user, setLocation]);

  return (
    <nav className="navbar d-flex justify-content-between" style={{zIndex:1}}>
      <div className="item-1">
        <div className="cursor-pointer px-5" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <>
              <span className="text-danger fw-bold">Close Categories &nbsp;</span>
              <i className="bi bi-x-lg"></i>
            </>
          ) : (
            <>
              <span className="text-success fw-bold">Expand Categories &nbsp;</span>
              <i className="bi bi-chevron-down"></i>
            </>
          )}
        </div>

        <div className={`drop-down ${isOpen ? "show" : ""}`}>
          <div className="category-grid row">
            {Categories.map((categoryData, index) => (
              <div className="category col-lg-3 col-md-4 col-6" key={index}>
                <div className="category-title">{categoryData.category}</div>
                <div className="category-items">
                  {categoryData.items.map((item, idx) => (
                    <div key={idx}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="location-info">
        {isMobile ? (
          <div className="cursor-pointer position-relative location-icon-container">
            <i className="bi bi-geo-alt fs-4" onClick={() => setShowLocation(!showLocation)}></i>
            {showLocation && (
              <div className="location-text">
                {city}, {country}
              </div>
            )}
          </div>
        ) : (
          <span className="fw-bold">{city}, {country}</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
