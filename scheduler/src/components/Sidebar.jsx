import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Wrench,
  Lightbulb,
  Settings,
  Mail
} from "lucide-react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {

  // 🔹 STEP 4: API call function
  const sendTodayJobsEmail = async () => {
    try {
      const res = await fetch("http://localhost:8000/jobs/send-today-email", {
        method: "POST"
      });

      const data = await res.json();
      alert(data.message || "Today's jobs email sent successfully");
    } catch (err) {
      alert("Failed to send today's jobs email");
    }
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🛠️</span>
        <span className="sidebar-logo-text">Menu</span>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">

        <Link to="/dashboard">
          <div className="sidebar-item">
            <LayoutDashboard />
            Dashboard
          </div>
        </Link>

        <Link to="/jobs">
          <div className="sidebar-item">
            <Briefcase />
            Jobs
          </div>
        </Link>

        <Link to="/staff">
          <div className="sidebar-item">
            <Users />
            Staff
          </div>
        </Link>

        <Link to="/jobtypes">
          <div className="sidebar-item">
            <Wrench />
            Job Types
          </div>
        </Link>

        <Link to="/skills">
          <div className="sidebar-item">
            <Lightbulb />
            Skills
          </div>
        </Link>

        <Link to="/settings">
          <div className="sidebar-item">
            <Settings />
            Settings
          </div>
        </Link>

        {/* 🔹 SEND TODAY JOBS EMAIL */}
        

      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* <p className="sidebar-footer-text">© 2025 JobTrack</p> */}
      </div>
      <div
          className="sidebar-item sidebar-email"
          onClick={sendTodayJobsEmail}
          style={{ cursor: "pointer" }}
        >
          <Mail />
          Send Today’s Jobs
        </div>

    </aside>
  );
}

export default Sidebar;
