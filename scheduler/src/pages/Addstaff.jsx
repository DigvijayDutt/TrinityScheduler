import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./AddStaff.css";

const AddStaff = () => {
  const skillOptions = [
    "Team Lead",
    "Lister",
    "Mover/Packer",
    "Cleaner",
    "Truck Driver",
    "Car Driver",
  ];

  const dropdownValues = [
    { value: "X", label: "X - Not an Option" },
    { value: "A", label: "A - Best Option" },
    { value: "B", label: "B - Second Option" },
    { value: "C", label: "C - Last Option" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: skillOptions.reduce((acc, skill) => {
      acc[skill] = "X";
      return acc;
    }, {}),
  });

  const handleSkillChange = (skill, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [skill]: value },
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
    alert("Staff Created Successfully!");
  };

  return (
    <div className="cj-layout">
      <Sidebar />

      <div className="cj-content">
        <h1 className="cj-title">Add New Staff</h1>
        <p className="cj-subtitle">
          Enter the details below to create a new team member.
        </p>

        {/* Employee Details */}
        <div className="cj-card">
          <h3 className="cj-section-title">Employee Details</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Employee Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="cj-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="e.g. jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Skill Section */}
        <div className="cj-card">
          <h3 className="cj-section-title">Skillset & Ranking</h3>

          {skillOptions.map((skill, index) => (
            <div className="cj-field" key={index}>
              <label>{skill}</label>
              <select
                value={formData.skills[skill]}
                onChange={(e) => handleSkillChange(skill, e.target.value)}
              >
                {dropdownValues.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="cj-bottom-btn-wrapper">
          <button className="cj-btn-primary" onClick={handleSubmit}>
            + Create Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
