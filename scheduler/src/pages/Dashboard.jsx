import React, { useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import JobCalendar from "../components/JobCalendar";

function Dashboard() {
  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="main-content flex-grow-1">
        <div className="dashboard-header">
          <h1>Dashboard</h1>

          <div className="legend">
            <span className="dot blue"></span> Upcoming
            <span className="dot yellow"></span> Ongoing
            <span className="dot green"></span> Completed
          </div>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="card">
            <h3>Total Jobs</h3>
            <p className="number">125</p>
            <button>Manage Jobs</button>
          </div>

          <div className="card">
            <h3>Staff Overview</h3>
            <p className="number">18</p>
            <button>Manage Staff</button>
          </div>

          <div className="card">
            <h3>Busy Staff</h3>
            <p className="number">24</p>
            <button>Manage Types</button>
          </div>

          <div className="card">
            <h3>Available Staff</h3>
            <p className="number">42</p>
            <button>Manage Skills</button>
          </div>
        </div>

        {/* REAL Calendar */}
        <div className="calendar-section">
          <JobCalendar />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
