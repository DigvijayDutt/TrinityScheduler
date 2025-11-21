// src/pages/Staff.jsx
import React, { useState } from "react";
import "./staff.css";
import Sidebar from "../components/Sidebar";
import { ThreeDots } from "react-bootstrap-icons";

const popularSkills = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Project Management",
  "Carpentry",
  "Welding",
  "Masonry",
];

const staffData = [
  {
    id: 1,
    name: "Olivia Chen",
    skills: ["Plumbing", "Electrical"],
    availability: "Available",
    job: "Not Assigned",
    image: "/avatars/1.png",
  },
  {
    id: 2,
    name: "Ben Carter",
    skills: ["Project Mgmt"],
    availability: "On Job",
    job: "Job #123 - Downtown",
    image: "/avatars/2.png",
  },
  {
    id: 3,
    name: "Aisha Khan",
    skills: ["Electrical", "HVAC"],
    availability: "Available",
    job: "Not Assigned",
    image: "/avatars/3.png",
  },
  {
    id: 4,
    name: "David Miller",
    skills: ["Deactivated"],
    availability: "Inactive",
    job: "Not Assigned",
    image: "/avatars/4.png",
  },
];

const Staff = () => {
  const [search, setSearch] = useState("");

  const filteredStaff = staffData.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="staff-container">
      <Sidebar />

      <div className="staff-content">
        <div className="staff-header">
          <h1>Staff Management</h1>

          <button className="add-staff-btn">+ Add New Staff</button>
        </div>

        {/* Search + Filters */}
        <div className="staff-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search by staff name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-buttons">
            <button className="filter-btn">Filter by Skill ▾</button>
            <button className="filter-btn">Availability ▾</button>
            <button className="filter-btn">Status ▾</button>
          </div>
        </div>

        {/* Popular Skills */}
        <div className="popular-skills">
          <p>Popular Skills:</p>
          <div className="skills-tags">
            {popularSkills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <table className="staff-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Core Competencies</th>
              <th>Availability</th>
              <th>Assigned Job(s)</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.map((s) => (
              <tr key={s.id}>
                <td>
                  <input type="checkbox" />
                </td>

                <td className="staff-name-cell">
                  <img src={s.image} alt="avatar" className="avatar" />
                  {s.name}
                </td>

                <td>
                  <div className="skill-chip-container">
                    {s.skills.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>

                <td>
                  <span
                    className={`availability-badge ${
                      s.availability === "Available"
                        ? "available"
                        : s.availability === "On Job"
                        ? "onjob"
                        : "inactive"
                    }`}
                  >
                    {s.availability}
                  </span>
                </td>

                <td className="job-cell">
                  {s.job !== "Not Assigned" ? (
                    <span className="job-link">{s.job}</span>
                  ) : (
                    "Not Assigned"
                  )}
                </td>

                <td>
                  <ThreeDots size={20} className="dots-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
