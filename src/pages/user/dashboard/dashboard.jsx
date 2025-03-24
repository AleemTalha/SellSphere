import React, { useState, useEffect } from "react";
import Loading from "../../../components/loading";
import Navbar from "../../../components/userNav/navbar";
import DashNav from "../../../components/DashNav/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardContent from "../../../components/DashboardContent/content";
import "./dashboard.css";
import Footer from "../../../components/Footer/Footer";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const showToast = (message, flag) => {
      if (flag) {
        toast.success(message, {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    };
  useEffect(() => {
    document.title = "SellSphere - Dashboard";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/dashboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const result = await response.json();
        if (response.ok && result.loggedIn) {
          setUser(result.user);
        }
      } catch (error) {
        showToast("Error fetching user data", false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDataLoading(true);
      try {
        const apiUrl = user ? "/dashboard/api" : "/dashboard/sample/api";
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (response.ok) {
          if (result.success)
          {
            showToast(result.message, true);
          } else if (!result.success) {
            showToast(result.message, false);
          }
          setDashboardData(result);
        } else {
          showToast(result.message, false);
        }
      } catch (error) {
        showToast("Error fetching dashboard data", false);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
        <div>
          <DashboardContent user={user} setUser={setUser} />
        </div>
      )}

      <div className="data-section" style={{ minHeight: "100vh" }}>
        {dataLoading==false ? (
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
          <div>data loaded</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
