import React, { useState, useEffect } from "react";
import Loading from "../../../components/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../../components/userNav/navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setUser(result.user);
      } catch (error) {
        toast.error(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      {loading ? (
        <Loading />
      ) : (
        <div className="dashboard-content">
          Welcome, {user?.fullName || "Guest"}!
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
