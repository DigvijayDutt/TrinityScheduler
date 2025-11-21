import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Skills.css";

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skills, setSkills] = useState([
    { id: 1, name: "Project Management", staff: 15, jobs: 8 },
    { id: 2, name: "Java Development", staff: 12, jobs: 5 },
    { id: 3, name: "UI/UX Design", staff: 9, jobs: 4 },
    { id: 4, name: "Data Analysis", staff: 7, jobs: 11 },
  ]);

  const handleEdit = (skill) => {
    setSelectedSkill(skill);
  };

  const handleDelete = (id) => {
    setSkills(skills.filter((s) => s.id !== id));
    setSelectedSkill(null);
  };

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
          <input type="text" placeholder="Search skills..." />
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
            {skills.map((skill) => (
              <tr
                key={skill.id}
                className={selectedSkill?.id === skill.id ? "row-selected" : ""}
                onClick={() => handleEdit(skill)}
              >
                <td>{skill.name}</td>
                <td>{skill.staff}</td>
                <td>{skill.jobs}</td>
                <td>
                  <span className="edit-btn">✏️</span>
                  <span
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(skill.id);
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
              Modify the details for '{selectedSkill.name}'.
            </p>

            <label>Skill Name</label>
            <input
              type="text"
              value={selectedSkill.name}
              onChange={(e) =>
                setSelectedSkill({ ...selectedSkill, name: e.target.value })
              }
            />

            <div className="warning-box">
              <strong>⚠ System-wide Impact</strong>
              <p>
                Renaming this skill will update {selectedSkill.staff} staff
                profiles and {selectedSkill.jobs} job requirements.
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
