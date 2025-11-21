import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Wrench,
  Lightbulb,
  Settings
} from "lucide-react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
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

        <div className="sidebar-item">
          <Settings />
          Settings
        </div>

      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">© 2025 JobTrack</p>
      </div>

    </aside>
  );
}

export default Sidebar;
