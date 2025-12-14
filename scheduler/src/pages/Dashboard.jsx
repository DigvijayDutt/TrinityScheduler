import React from "react";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    fetch("http://localhost:8000/calender/2025-12-25")
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="dashboard-container d-flex">

      {/* Sidebar Component */}
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
            <ul>
              <li>Job #125: AC Repair</li>
              <li>Job #124: Plumbing Fix</li>
              <li>Job #123: Electrical Check</li>
            </ul>
            <button>Manage Jobs</button>
          </div>

          <div className="card">
            <h3>Staff Overview</h3>
            <p className="number">18</p>
            <ul>
              <li>John Doe</li>
              <li>Jane Smith</li>
              <li>Mike Johnson</li>
            </ul>
            <button>Manage Staff</button>
          </div>

          <div className="card">
            <h3>Busy Staff</h3>
            <p className="number">24</p>
            <ul>
              <li>HVAC Maintenance</li>
              <li>Emergency Plumbing</li>
              <li>General Carpentry</li>
            </ul>
            <button>Manage Types</button>
          </div>

          <div className="card">
            <h3>Available Staff</h3>
            <p className="number">42</p>
            <ul>
              <li>Welding Certified</li>
              <li>Licensed Electrician</li>
              <li>Master Plumber</li>
            </ul>
            <button>Manage Skills</button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-header">
            <div className="month-nav">
              <button>{"<"}</button>
              <h3>November 2024</h3>
              <button>{">"}</button>
            </div>
            <button className="today-btn">Today</button>
          </div>

          <div className="calendar">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              ...Array.from({ length: 31 }, (_, i) => i + 1),
            ].map((val, i) =>
              i < 7 ? (
                <div key={i} className="day-header">
                  {val}
                </div>
              ) : (
                <div key={i} className="day-cell">
                  <span>{val}</span>
                  {i === 7 && <span style={{ display: "block", backgroundColor: "#60a5fa", color: "white", padding: "5px", borderRadius: "5px" }}>
                    J-10234</span>}
                  {i === 8 && <span style={{ display: "block", backgroundColor: "#facc15", color: "black", padding: "5px", borderRadius: "5px" }}>
                    J-10234</span>}
                  {i === 9 && <span style={{ display: "block", backgroundColor: "#22c55e", color: "white", padding: "5px", borderRadius: "5px" }}>
                    J-10234</span>}
                </div>
              )
            )}
          </div>
        </div>

        
      </main>

    </div>
  );
}

export default Dashboard;
