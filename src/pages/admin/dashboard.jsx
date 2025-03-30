import React from "react";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <ul>
            <li>Overview</li>
            <li>Users</li>
            <li>Settings</li>
            <li>Reports</li>
          </ul>
        </aside>
        <main className="dashboard-main">
          <h2>Welcome, Admin!</h2>
          <p>Here is your dashboard overview.</p>
          <div className="dashboard-stats">
            <div className="stat-card">Users: 120</div>
            <div className="stat-card">Sales: $5,000</div>
            <div className="stat-card">Reports: 15</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
