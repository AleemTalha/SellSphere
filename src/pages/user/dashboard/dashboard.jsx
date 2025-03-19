import React, { useState } from "react";

const dashboard = () => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://mern-project-2-production.up.railway.app/check-dev-mode",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.text();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={fetchData}>Fetch Data</button>
      <div>{data}</div>
    </div>
  );
};

export default dashboard;
