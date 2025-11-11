import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div
            className="avatar"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTkrMHbbGod9c6Sv6M5UawHX-tUIz_5V0f1CVuXR8lQBw2Y8TkK64fZbX0-4dpXw3XpKAdDDGrszQtVHgXS3mi_iTESYn4eYLWFScWLyDbp7Fy1DfeSN6yJ9p2YdEjLb-PbSMDwmSHN1r-BHRTm6PKA-BESehNR5k8yq-jclL1JMHLjziF2r6bELRNgu-S4xzuHcXDd9RnY1mPvyrrLiT4JQfvLJjoPE7b0Dcnv2CH4MD5thmqMvh3GE7W_KCHn11NxFxVKPc2THZR')",
            }}
          ></div>
          <div>
            <h2>Admin User</h2>
            <p>admin@company.com</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <a href="#" className="active">
            <span className="icon">📊</span> Dashboard
          </a>
          <a href="#">
            <span className="icon">💼</span> Jobs
          </a>
          <a href="#">
            <span className="icon">👥</span> Staff
          </a>
          <a href="#">
            <span className="icon">📚</span> Job Types
          </a>
          <a href="#">
            <span className="icon">🧠</span> Skills
          </a>
          <a href="#">
            <span className="icon">⚙️</span> Settings
          </a>
        </nav>

        <button className="add-job-btn">+ Add New Job</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="legend">
            <span className="dot blue"></span> Upcoming
            <span className="dot yellow"></span> Ongoing
            <span className="dot green"></span> Completed
          </div>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-header">
            <div className="month-nav">
              <button>{"<"}</button>
              <h3>October 2023</h3>
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
                <div key={val} className="day-header">
                  {val}
                </div>
              ) : (
                <div key={val} className="day-cell">
                  <span>{val}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <h2 className="overview-title">Management Overview</h2>
        <div className="overview-grid">
          <div className="card">
            <h3>Recent Jobs</h3>
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
            <h3>Job Types</h3>
            <p className="number">24</p>
            <ul>
              <li>HVAC Maintenance</li>
              <li>Emergency Plumbing</li>
              <li>General Carpentry</li>
            </ul>
            <button>Manage Types</button>
          </div>

          <div className="card">
            <h3>Skills Matrix</h3>
            <p className="number">42</p>
            <ul>
              <li>Welding Certified</li>
              <li>Licensed Electrician</li>
              <li>Master Plumber</li>
            </ul>
            <button>Manage Skills</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
