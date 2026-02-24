// src/pages/Skills.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Skills.css";

const Skills = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [search, setSearch] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch skills from backend
  useEffect(() => {
    fetch("/trinity/api/skills")
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error(err));
  }, []);

  // Select a skill to edit
  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setEditName(skill.name);
    setEditDescription(skill.description || "");
  };

  // Delete skill
  const handleDelete = async (skillId,skillName) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await fetch(`/trinity/api/skills/${skillId}`, {
        method: "DELETE",
      });
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      setSelectedSkill(null);

      await fetch(`/trinity/api/jobtypescol/${skillName}`,{method: "DELETE",});
      await fetch(`/trinity/api/employeescol/${skillName}`,{method: "DELETE",});
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill");
    }
  };

  // Save edited skill
  const saveEdit = async () => {
    if (!editName.trim()) return alert("Skill name cannot be empty");

    try {
      const res = await fetch(`/trinity/api/skills/${selectedSkill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      if (!res.ok) throw new Error();

      // Update frontend
      setSkills(prev => prev.map(skill =>
        skill.id === selectedSkill.id ? { ...skill, name: editName, description: editDescription } : skill
      ));
      setSelectedSkill(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update skill");
    }
  };

  // Filtered skills for search
  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="skills-container">
      <Sidebar />

      <div className="skills-content">
        <h1 className="skills-title">Manage Skills</h1>
        <p className="skills-subtitle">
          Add, edit, or remove skills used for staff profiles and job requirements.
        </p>

        <button
          className="add-skill-btn"
          onClick={() => navigate("/addskills")}
        >
          + Add New Skill
        </button>

        <div className="skills-search">
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="skills-table">
          <thead>
            <tr>
              <th>SKILL NAME</th>
              <th>DESCRIPTION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.map(skill => (
              <tr
                key={skill.id}
                className={selectedSkill?.id === skill.id ? "row-selected" : ""}
                onClick={() => handleEdit(skill)}
              >
                <td>{skill.name}</td>
                <td>{skill.description || "—"}</td>
                <td>
                  <span
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(skill.id,skill.name);
                    }}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedSkill && (
          <div className="skill-edit-panel">
            <h2>Edit Skill</h2>
            <p className="edit-desc">
              Modify the details for '{selectedSkill.name}'.
            </p>

            <label>Skill Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <label>Skill Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <div className="warning-box">
              <strong>⚠ System-wide Impact</strong>
              <p>
                Renaming or editing this skill will update staff profiles
                and job requirements across the system.
              </p>
            </div>

            <div className="edit-actions">
              <button className="cancel-btn" onClick={() => setSelectedSkill(null)}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveEdit}>
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
