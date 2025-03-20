import React, { useState, useEffect } from "react";
import Loading from "../../../components/loading";
import { div } from "framer-motion/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";




const dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const result = await response.text();
        setUser(result);
      } catch (error) {
        
      }
    };
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (<Loading />) : (
      (
        <div>
          <h1>Dashboard</h1>
          <p>{data}</p>
          </div>
        )
      )}
    </div>
  );
};

export default dashboard;
