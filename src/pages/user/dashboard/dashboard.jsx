import React, { useState, useEffect } from "react";
import Loading from "../../../components/loading";
import Navbar from "../../../components/userNav/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
            if(result.loggedIn){
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

  return (
    <div>
      <ToastContainer />
      <Navbar user={user} setUser={setUser} />
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1>Dashboard</h1>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
