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

        <div className="sidebar-item">
          <LayoutDashboard />
          Dashboard
        </div>

        <div className="sidebar-item sidebar-item-active">
          <Briefcase />
          Jobs
        </div>

        <div className="sidebar-item">
          <Users />
          Staff
        </div>

        <div className="sidebar-item">
          <Wrench />
          Job Types
        </div>

        <div className="sidebar-item">
          <Lightbulb />
          Skills
        </div>

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
