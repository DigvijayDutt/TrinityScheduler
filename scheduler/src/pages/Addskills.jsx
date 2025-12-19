import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./AddSkills.css";

const AddSkills = () => {
  const navigate  = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    fetch("http://localhost:8000/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => navigate("/skills"))
      .catch((err) => {
        console.error(err);
        navigate("/skills");
      });
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

          <div className="cj-grid-2">
            {/* Skill Name - TEXT */}
            <div className="cj-field">
              <label>Skill Name</label>
              <input
                type="text"
                placeholder="e.g. Team Lead"
                name="skillName"
              />
            </div>

            {/* Staff With Skill - TEXT */}
            <div className="cj-field">
              <label>Staff With Skill</label>
              <input
                type="text"
                placeholder="e.g. John"
                name="staff"
              />
            </div>

            {/* Jobs Requiring Skill - NUMBER */}
            <div className="cj-field">
              <label>Jobs Requiring Skill</label>
              <input
                type="number"
                placeholder="e.g. 12"
                min="0"
                name="jobs"
              />
            </div>
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
