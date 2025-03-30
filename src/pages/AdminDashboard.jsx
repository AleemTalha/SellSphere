import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const AdminDashboard = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const showToast = (flag, message) => {
    toast(message, {
      type: flag ? "success" : "error",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    const API_URI = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URI}/admin/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessage(data.message);
        showToast(true, "Data fetched successfully!");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        showToast(false, "Failed to fetch data. Redirecting to login...");
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Admin Dashboard</h3>
        </div>
        <div className="card-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
