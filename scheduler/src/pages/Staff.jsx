// src/pages/Staff.jsx
import React, { useState,useEffect } from "react";
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
  const [staff, setStaff] = useState([]);
  const [skills,setSkills] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:8000/employees")
    .then(res => res.json())
    .then(data => setStaff(data))
    .catch(err=>console.log(err));
  },[]);

  useEffect(()=>{
    fetch("http://localhost:8000/skills")
    .then(res=>res.json())
    .then(data=>setSkills(data))
    .catch(err=>console.log(err));
  },[]);

  const filteredStaff = staff.filter((staff) =>
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
            {skills.map((skill,index) => (
              <span key={index} className="skill-tag">
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
            {staffData.map((s) => (
              <tr key={s.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="staff-name-cell">
                  {s.name}
                </td>

                <td>
                  <div className="skill-chip-container">
                    {s.skills.map((skill,index)=>(
                      <span key={index} className="skill-chip">
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
            {filteredStaff.map((s,index)=>(
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="staff-name-cell">{s.name}</td>

                <td>
                  <div className="skill-chip-container">
                    {Object.keys(s).filter(key=> s[key]===3).map((key,index)=>(
                      <span key={index} className="skill-chip">
                        {key}
                      </span>
                    ))}
                  </div>
                </td>
                <td>availability</td>
                <td>job</td>
                <td><ThreeDots size={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
