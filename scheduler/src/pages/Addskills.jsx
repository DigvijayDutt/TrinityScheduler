import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./AddSkills.css";

const AddSkills = () => {
  const [formData, setFormData] = useState({
    skillName: "",
    staffWithSkill: "",
    jobsRequiringSkill: "",
  });

  const handleSubmit = () => {
    if (
      !formData.skillName ||
      !formData.staffWithSkill ||
      !formData.jobsRequiringSkill
    ) {
      alert("Please fill all fields");
      return;
    }

    console.log(formData);
    alert("Skill Created Successfully!");
  };

  return (
    <div className="cj-layout">
      <Sidebar />

      <div className="cj-content">
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
                value={formData.skillName}
                onChange={(e) =>
                  setFormData({ ...formData, skillName: e.target.value })
                }
              />
            </div>

            {/* Staff With Skill - TEXT */}
            <div className="cj-field">
              <label>Staff With Skill</label>
              <input
                type="text"
                placeholder="e.g. John"
                value={formData.staffWithSkill}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    staffWithSkill: e.target.value,
                  })
                }
              />
            </div>

            {/* Jobs Requiring Skill - NUMBER */}
            <div className="cj-field">
              <label>Jobs Requiring Skill</label>
              <input
                type="number"
                placeholder="e.g. 12"
                min="0"
                value={formData.jobsRequiringSkill}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobsRequiringSkill: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="cj-bottom-btn-wrapper">
          <button className="cj-btn-primary" onClick={handleSubmit}>
            + Create Skill
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkills;
