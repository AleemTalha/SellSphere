import React, { useState, useEffect } from "react";

const dashboard = () => {
  const [data, setData] = useState("");
  const API_URL = import.meta.env.VITE_API_URL + "/dashboard";

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.text();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>{data}</div>
    </div>
  );
};

export default dashboard;
