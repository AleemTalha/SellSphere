import React, { useState, useEffect } from "react";
import Loading from "../../../components/loading";
import Navbar from "../../../components/userNav/navbar";
import DashNav from "../../../components/DashNav/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import DashboardContent from "../../../components/DashboardContent/content";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SellSphere - Dashboard";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        if (response.ok) {
          if (result.loggedIn) {
            setUser(result.user);
          }
        } else {
          toast.error(result.message || "Failed to fetch user data", {
            autoClose: 5000,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch user data: " + error.message, {
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/update/location`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ latitude, longitude }),
          }
        );
        const result = await response.json();
        if (response.ok) {
          setUser((prevUser) => ({
            ...prevUser,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          }));
        } else {
          toast.error(
            "Location : " + result.message || "Failed to update location",
            {
              autoClose: 5000,
            }
          );
        }
      } catch (error) {
        toast.error("Failed to update location: " + error.message, {
          autoClose: 5000,
        });
      }
    };

    const fetchCityAndCountry = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        setCity(data.city || data.locality || "Unknown location");
        setCountry(data.countryName || "Unknown country");
      } catch (error) {
        toast.error("Failed to fetch city and country: " + error.message, {
          autoClose: 5000,
        });
      }
    };

    if (
      user &&
      (!user.location ||
        !user.location.coordinates ||
        user.location.coordinates.length === 0)
    ) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            updateLocation(latitude, longitude);
            fetchCityAndCountry(latitude, longitude);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              const userLocation = prompt(
                "Please enter your location (latitude, longitude):"
              );
              if (userLocation) {
                const [latitude, longitude] = userLocation
                  .split(",")
                  .map(Number);
                setLocation({ latitude, longitude });
                updateLocation(latitude, longitude);
                fetchCityAndCountry(latitude, longitude);
              } else {
                alert("Location is required to proceed.");
              }
            } else {
              alert("Unable to retrieve location. Please try again.");
            }
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  }, [user]);

  return (
    <div>
      <ToastContainer />
      <Navbar user={user} setUser={setUser} />
      <DashNav location={{ city, country }} setLocation={setLocation} />
      {loading ? (
        <Loading />
      ) : (
        <div>
          <DashboardContent user={user} setUser={setUser} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
