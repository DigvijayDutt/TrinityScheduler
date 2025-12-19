import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Skills.css";

const Skills = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [search, setSearch] = useState("");
  const [emps, setEmps] = useState([]);

  // Fetch skills from backend
  useEffect(() => {
    fetch("http://localhost:8000/skills")
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error(err));
  }, []);
  
  useEffect(() => {
    fetch("http://localhost:8000/employees")
      .then((res) => res.json())
      .then((data) => setEmps(data))
      .catch((err) => console.error(err));
  }, []);
  // Handle edit
  const handleEdit = (skill) => {
    setSelectedSkill(skill);
  };

  const getEmployeesWithSkill = (skillName) => {
    return emps
      .filter(emp => Number(emp[skillName]) > 0)
      .map(emp => emp.name);
  };


  // Handle delete
  const handleDelete = (skillToDelete) => {
    fetch(`http://localhost:8000/skills/${skillToDelete}`, {
      method: "DELETE",
    })
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToDelete)
    );
    setSelectedSkill(null);
  };

  const saveEdit = (skill) =>{
    fetch(`http://localhost:8000/skills/${skill},${skill}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }
  return (
    <div className="skills-container">
      <Sidebar />

      <div className="skills-content">
        <h1 className="skills-title">Manage Skills</h1>
        <p className="skills-subtitle">
          Add, edit, or remove skills used for staff profiles and job requirements.
        </p>

        {/* ✅ CONNECTED BUTTON */}
        <button
          className="add-skill-btn"
          onClick={() => navigate("/addskills")}
        >
          + Add New Skill
        </button>

        {/* Search Bar */}
        <div className="skills-search">
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Skills Table */}
        <table className="skills-table">
          <thead>
            <tr>
              <th>SKILL NAME</th>
              <th>STAFF WITH SKILL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {skills
              .filter((skill) =>
                skill
                  .toString()
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((skill, index) => (
                <tr
                  key={index}
                  className={
                    selectedSkill === skill ? "row-selected" : ""
                  }
                  onClick={() => handleEdit(skill)}
                >
                  <td>{skill}</td>
                  <td>
                      {getEmployeesWithSkill(skill).length > 0
                        ? getEmployeesWithSkill(skill).join(", ")
                        : "—"}
                  </td>
                  <td>
                    <span className="edit-btn">✏️</span>
                    <span
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(skill.toString());
                      }}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Right Panel – Edit Skill */}
        {selectedSkill && (
          <div className="skill-edit-panel">
            <h2>Edit Skill</h2>
            <p className="edit-desc">
              Modify the details for '{selectedSkill}'.
            </p>

            <label>Skill Name</label>
            <input
              type="text"
              value={selectedSkill}
              readOnly
            />

            <div className="warning-box">
              <strong>⚠ System-wide Impact</strong>
              <p>
                Renaming this skill will update staff profiles
                and job requirements across the system.
              </p>
            </div>

            <div className="edit-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedSkill(null)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={()=>(saveEdit(selectedSkill))}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
