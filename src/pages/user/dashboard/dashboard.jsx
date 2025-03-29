import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import Loading from "../../../components/loading";
import Navbar from "../../../components/userNav/navbar";
import DashNav from "../../../components/DashNav/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardContent from "../../../components/DashboardContent/content";
import "./dashboard.css";
import Card from "../../../components/dashCards/card";
import Footer from "../../../components/Footer/Footer";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({ recentAds: [] });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [done, setDone] = useState(false);
  const dataSectionRef = useRef(null);
  const [dataFetched, setDataFetched] = useState(false);

  const showToast = (message, flag) => {
    toast[flag ? "success" : "error"](message, {
      position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      newestOnTop: true,
      autoClose: 5000,
    });
  };

  useEffect(() => {
    document.title = "SellSphere - Dashboard";
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const API_URI = import.meta.env.VITE_API_URI || "http://localhost:3000";
        const response = await fetch(`${API_URI}/dashboard`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const result = await response.json();
        if (response.ok && result.loggedIn) {
          // console.log(result.user);
          showToast(result.message, true);
          setUser(result.user);
          await new Promise((resolve) => {
            setDone(true);
            resolve();
          });
          // console.log("Done state set to true");
        }
      } catch (error) {
        showToast("Error fetching user data", false);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const fetchLocationFromLocalStorage = async () => {
        const storedLocation = localStorage.getItem("userLocation");
        if (storedLocation) {
          const { latitude, longitude } = JSON.parse(storedLocation);
          setLatitude(latitude);
          setLongitude(longitude);
          // console.log("Location fetched from localStorage:", {
          // latitude,
          // longitude,
          // });
          return { latitude, longitude };
        } else {
          // console.error("No location found in localStorage.");
          // throw new Error("Location not available");
        }
      };

      const location = await fetchLocationFromLocalStorage();
      // if (!location.latitude || !location.longitude) {
      // console.error("Latitude or Longitude is null.");
      // throw new Error("Invalid location data");
      // }

      const API_URI = import.meta.env.VITE_API_URI || "http://localhost:3000";
      const apiUrl = `${API_URI}/dashboard/api`;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          lat: location.latitude,
          lon: location.longitude,
        }),
      };

      // console.log(`Fetching data from: ${apiUrl}`);
      // console.log(`Request Body:`, {
      // lat: location.latitude,
      // lon: location.longitude,
      // });

      const response = await fetch(apiUrl, options);
      const result = await response.json();

      if (response.ok) {
        showToast(result.message, result.success);
        setDashboardData(result);
      } else {
        const response2 = await fetch(`${API_URI}/dashboard/sample/api`, {
          credentials: "include",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result2 = await response2.json();
        if (response2.ok) {
          showToast(result2.message, result2.success);
          setDashboardData(result2);
        } else {
          showToast(result2.message, false);
        }
      }
    } catch (error) {
      // showToast(error.message || "Error fetching dashboard data", false);
      const API_URI = import.meta.env.VITE_API_URI || "http://localhost:3000";
      const response2 = await fetch(`${API_URI}/dashboard/sample/api`, {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result2 = await response2.json();
      if (response2.ok) {
        showToast(result2.message, result2.success);
        setDashboardData(result2);
      } else {
        showToast(result2.message, false);
      }
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !dataFetched) {
        setDataFetched(true);
        fetchDashboardData();
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.1,
    });

    if (dataSectionRef.current) {
      observer.observe(dataSectionRef.current);
    }

    return () => {
      if (dataSectionRef.current) {
        observer.unobserve(dataSectionRef.current);
      }
    };
  }, [dataFetched]);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    setScrollPercentage(scrollPercent);
    setShowScrollButton(scrollTop > 300);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setLocation = (location) => {
    setCity(location.city);
    setCountry(location.country);
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <Navbar user={user} setUser={setUser} />
      <DashNav user={user} setLocation={setLocation} />

      {showScrollButton && (
        <div className="scroll-circle" onClick={scrollToTop}>
          <svg viewBox="0 0 100 100" className="progress-ring">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-ring__background"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-ring__progress"
              style={{
                strokeDasharray: "282.74",
                strokeDashoffset: `${
                  282.74 - (282.74 * scrollPercentage) / 100
                }`,
              }}
            />
          </svg>
          <span className="scroll-arrow">
            <i className="bi bi-arrow-up"></i>
          </span>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <DashboardContent user={user} setUser={setUser} />
      )}

      <div
        className="data-section"
        ref={dataSectionRef}
        style={{ minHeight: "100vh" }}
      >
        {dataLoading ? (
          <div className="spinner-container d-flex justify-content-center align-items-start pt-5">
            <div className="pulse-loader mt-3">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <>
            <div className="px-lg-4 px-md-3 px-sm-2 px-1">
              <div className="d-flex mb-3 justify-content-between align-items-center">
                <div>
                  <h2>Latest Listings</h2>
                  <p className="text-muted">Explore the latest ads </p>
                </div>
                <Link to="/categories/recent-ads" className="view-more-link">
                  View More <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="d-card-wrapper">
              <div className="d-card-container">
                {dashboardData.recentAds.length > 0 ? (
                  dashboardData.recentAds.map((ad) => (
                    <Card key={ad._id} ad={ad} />
                  ))
                ) : (
                  <p className="text-center">
                    No listings available at the moment.
                  </p>
                )}
              </div>
            </div>

            {[
              { title: "Mobile Phones", data: dashboardData.mobilePhones },
              { title: "Cars", data: dashboardData.cars },
              { title: "Houses", data: dashboardData.houses },
              { title: "Beauty Products", data: dashboardData.beautyProducts },
              { title: "Apartments", data: dashboardData.apartments },
              { title: "Foldable Phones", data: dashboardData.foldablePhones },
            ].map((category) => (
              <div
                key={category.title}
                className="px-lg-4 px-md-3 px-sm-2 px-1 pt-5"
              >
                <div className="d-flex mb-3 justify-content-between align-items-center">
                  <div>
                    <h2>{category.title}</h2>
                    <p className="text-muted">Explore {category.title}</p>
                  </div>
                  <Link
                    to={`/categories/${slugify(category.title, {
                      lower: true,
                    })}`}
                    className="view-more-link"
                  >
                    View More <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="d-card-wrapper">
                  <div className="d-card-container">
                    {category.data?.length > 0 ? (
                      category.data.map((ad) => <Card key={ad._id} ad={ad} />)
                    ) : (
                      <p className="text-center">
                        No Ads available for "{category.title}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <section className="container my-5">
        <div className="row text-center">
          <div className="col-md-6">
            <h2 className="fw-bold">Sell with Confidence</h2>
            <p>
              Post your ads effortlessly and reach genuine buyers quickly.
              Whether it's cars, electronics, or property, SellSphere connects
              you to the right audience.
            </p>
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">Find Your Best Deal</h2>
            <p>
              Explore a variety of listings at unbeatable prices. From brand-new
              to second-hand items, discover deals that match your needs and
              budget.
            </p>
          </div>
        </div>

        <div className="row text-center mt-4">
          <div className="col-md-6">
            <h3 className="fw-bold">Safe & Secure Transactions</h3>
            <p>
              Trade worry-free with verified buyers and sellers. Our platform
              ensures secure dealings, giving you complete peace of mind.
            </p>
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold">Quick & Easy Selling</h3>
            <p>
              Upload your ad in minutes, set your price, and start receiving
              offers. Selling has never been this simple and efficient!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
