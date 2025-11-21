// src/pages/JobTypes.jsx
import React, { useState } from "react";
import "./jobtypes.css";
import Sidebar from "../components/Sidebar";
import { Trash3 } from "react-bootstrap-icons";

const initialJobTypes = [
  {
    id: 1,
    name: "Electrical Installation",
    skills: ["Wiring", "Circuit Breakers"],
    minStaff: 2,
    duration: 4,
    active: true,
  },
  {
    id: 2,
    name: "Plumbing Inspection",
    skills: ["Pipe Fittings"],
    minStaff: 1,
    duration: 3,
    active: true,
  },
  {
    id: 3,
    name: "HVAC Maintenance",
    skills: ["Cooling Systems"],
    minStaff: 2,
    duration: 5,
    active: true,
  },
  {
    id: 4,
    name: "Site Survey",
    skills: [],
    minStaff: 1,
    duration: 1,
    active: false,
  },
];

const JobTypes = () => {
  const [jobTypes, setJobTypes] = useState(initialJobTypes);
  const [selectedId, setSelectedId] = useState(1);
  const [skillInput, setSkillInput] = useState("");

  const selected = jobTypes.find((j) => j.id === selectedId);

  const updateField = (field, value) => {
    setJobTypes((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, [field]: value } : item
      )
    );
  };

  const addSkill = () => {
    if (skillInput.trim() === "") return;

    updateField("skills", [...selected.skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    updateField(
      "skills",
      selected.skills.filter((s) => s !== skill)
    );
  };

  return (
    <div className="jobtypes-container">
      <Sidebar />

      <div className="jobtypes-content">
        {/* Page Title */}
        <h1 className="jobtypes-title">Job Types</h1>

        <div className="jobtypes-grid">
          {/* LEFT COLUMN – Job Type List */}
          <div className="jobtypes-list-card">

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search job types..."
              className="jobtypes-search"
            />

            {/* Job Type Items */}
            <div className="jobtypes-list">
              {jobTypes.map((jt) => (
                <div
                  key={jt.id}
                  className={`jobtype-item ${
                    selectedId === jt.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedId(jt.id)}
                >
                  <span className="jobtype-item-icon">⚡</span>
                  {jt.name}
                </div>
              ))}
            </div>

            {/* Add New Button */}
            <button className="add-jobtype-btn">
              + Add New Job Type
            </button>
          </div>

          {/* RIGHT SIDE – Editing Panel */}
          <div className="jobtypes-edit-card">
            {selected ? (
              <>
                <div className="edit-header">
                  <h2>Editing: {selected.name}</h2>

                  <Trash3 size={20} className="delete-icon" />
                </div>

                {/* Job Type Name */}
                <label className="field-label">Job Type Name</label>
                <input
                  type="text"
                  className="field-input"
                  value={selected.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                {/* Required Skills */}
                <label className="field-label">Required Skills</label>
                <div className="skills-box">
                  {selected.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ✕
                    </span>
                  ))}

                  <input
                    type="text"
                    className="skill-input"
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                </div>

                <p className="note-text">
                  These skills will be automatically suggested for new jobs of
                  this type.
                </p>

                {/* Min Staff + Duration */}
                <div className="two-col">
                  <div>
                    <label className="field-label">Minimum Staff</label>
                    <input
                      type="number"
                      className="field-input"
                      value={selected.minStaff}
                      onChange={(e) =>
                        updateField("minStaff", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      Default Duration (hours)
                    </label>
                    <input
                      type="number"
                      className="field-input"
                      value={selected.duration}
                      onChange={(e) =>
                        updateField("duration", parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <label className="field-label">Status</label>
                <div className="status-row">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={selected.active}
                      onChange={(e) => updateField("active", e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span>Active</span>
                </div>

                {/* Buttons */}
                <div className="button-row">
                  <button className="cancel-btn">Cancel</button>
                  <button className="save-btn">Save Changes</button>
                </div>
              </>
            ) : (
              <p>Select a job type to edit...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTypes;
