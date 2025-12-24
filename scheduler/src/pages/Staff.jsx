// src/pages/Staff.jsx
import React, { useState, useEffect } from "react";
import "./staff.css";
import Sidebar from "../components/Sidebar";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

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
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/employees")
      .then(res => res.json())
      .then(data => setStaff(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/skills")
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.log(err));
  }, []);

  const filteredStaff = staff.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );


  // prabhat's delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;

    try {
      const res = await fetch(`http://localhost:8000/employees/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      // remove from UI
      setStaff((prev) => prev.filter((s) => s.id !== id));

      alert("Staff deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete staff");
    }
  };






  return (
    <div className="staff-container">
      <Sidebar />

      <div className="staff-content">
        <div className="staff-header">
          <h1>Staff Management</h1>

          <Link to="/addstaff" style={{ textDecoration: "none" }}>
            <button className="add-staff-btn">+ Add New Staff</button>
          </Link>        
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
            <DropdownButton title="Filter by Skill" id="dropdown-basic-button" variant="outline-secondary">
              {/* {skills.map((skill, index) => (
                <Dropdown.Item key={index}>{skill}</Dropdown.Item>
              ))} */}

              {/* prabhat's */}
              {skills.map((skill, index) => (
                <Dropdown.Item key={skill.id}>{skill.name}</Dropdown.Item>
              ))}


            </DropdownButton>
            <DropdownButton title="Availability" id="dropdown-basic-button" variant="outline-secondary">
              <Dropdown.Item>Available</Dropdown.Item>
              <Dropdown.Item>On Job</Dropdown.Item>
              <Dropdown.Item>Inactive</Dropdown.Item>
            </DropdownButton>
            <DropdownButton title="Status" id="dropdown-basic-button" variant="outline-secondary">
              <Dropdown.Item>Active</Dropdown.Item>
              <Dropdown.Item>Inactive</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>

        {/* Popular Skills */}
        <div className="popular-skills">
          <p>Popular Skills:</p>
          <div className="skills-tags">
            {/* {skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))} */}
            
            {/* prabhat's */}
            {skills.map((skill) => (
              <span key={skill.id} className="skill-tag">{skill.name}</span>
            ))}


          </div>
        </div>

        {/* Staff Table */}
        <table className="staff-table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Core Competencies</th>
              <th>Assigned Job(s)</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.map((s, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{s.id}</td>
                <td className="staff-name-cell">{s.name}</td>

                <td>
                  {/* <div className="skill-chip-container">
                    {(Object.keys(s).filter(key => s[key] === 3).length > 0
                      ? Object.keys(s).filter(key => s[key] === 3)
                      : Object.keys(s).filter(key => s[key] === 2)
                    ).map((key, index) => (
                      <span key={index} className="skill-chip">
                        {key}
                      </span>
                    ))}
                  </div> */}

                  {/* prabhat's */}
                  <div className="skill-chip-container">
                    {skills
                      .filter(skill => Number(s[skill.name]) > 0)
                      .map(skill => (
                        <span key={skill.id} className="skill-chip">{skill.name}</span>
                      ))
                    }
                  </div>



                </td>
                <td>job</td>
                {/* <td><ThreeDots size={20} /></td> */}

                <td>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="three-dot-btn"
                    >
                      <ThreeDots size={18} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="text-danger"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
