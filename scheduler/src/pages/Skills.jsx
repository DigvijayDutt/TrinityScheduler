import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./Skills.css";

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skills, setSkills] = useState([]);

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
  };

  const handleDelete = (id) => {
    setSkills(skills.filter((s) => s !== id));
    setSelectedSkill(null);
  };

  useEffect(() => {
    fetch("http://localhost:8000/skills")
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.log(err));
  }, []);

  const [search, setSearch] = useState("");

  return (
    <div className="skills-container">
      <Sidebar />

      <div className="skills-content">
        <h1 className="skills-title">Manage Skills</h1>
        <p className="skills-subtitle">
          Add, edit, or remove skills used for staff profiles and job requirements.
        </p>

        <button className="add-skill-btn">+ Add New Skill</button>

        {/* Search Bar */}
        <div className="skills-search">
          <input type="text" placeholder="Search skills..." onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Skills Table */}
        <table className="skills-table">
          <thead>
            <tr>
              <th>SKILL NAME</th>
              <th>STAFF WITH SKILL</th>
              <th>JOBS REQUIRING SKILL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {skills.filter((skill) => skill.toLowerCase().includes(search.toLowerCase())).map((skill, index) => (
              <tr
                key={index}
                className={selectedSkill === skills[index] ? "row-selected" : ""}
                onClick={() => handleEdit(skill)}
              >
                <td>{skill}</td>
                <td>staff</td>
                <td>jobs</td>
                <td>
                  <span className="edit-btn">✏️</span>
                  <span
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(skill);
                    }}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Right Section - Edit Skill */}
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
            />

            <div className="warning-box">
              <strong>⚠ System-wide Impact</strong>
              <p>
                Renaming this skill will update staff
                profiles and job requirements.
              </p>
            </div>

            <div className="edit-actions">
              <button className="cancel-btn" onClick={() => setSelectedSkill(null)}>
                Cancel
              </button>

              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
