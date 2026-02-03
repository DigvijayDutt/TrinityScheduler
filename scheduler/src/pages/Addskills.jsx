// src/pages/AddSkills.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Addskills.css";

const AddSkills = () => {
  const navigate = useNavigate();
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedSkill = skillName.trim().toLowerCase();
    if (!trimmedSkill) return alert("Skill name cannot be empty");

    try {
      const res = await fetch("http://localhost:8000/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName: trimmedSkill, description }),
      });
      const data = await res.json();

      if (!res.ok) return alert(data.message || "Failed to add skill");

      navigate("/skills");
    } catch (err) {
      console.error(err);
      alert("Failed to add skill");
    }
  };

  return (
    <div className="cj-layout">
      <Sidebar />

      <div className="cj-content">
        <form onSubmit={handleSubmit}>
          <h1 className="cj-title">Add New Skill</h1>
          <p className="cj-subtitle">
            Enter the details below to create a new skill.
          </p>

          <div className="cj-card">
            <h3 className="cj-section-title">Skill Information</h3>

            {/* Skill Name */}
            <div className="cj-field">
              <label>Skill Name</label>
              <input
                type="text"
                placeholder="e.g. Team Lead"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>

            {/* Skill Description */}
            <div className="cj-field">
              <label>Skill Description</label>
              <textarea
                placeholder="Describe the skill..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="cj-bottom-btn-wrapper">
            <button className="cj-btn-primary" type="submit">
              + Create Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkills;
