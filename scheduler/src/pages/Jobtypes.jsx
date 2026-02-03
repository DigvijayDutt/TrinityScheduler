// src/pages/JobTypes.jsx
import React, { useState, useEffect } from "react";
import "./Jobtypes.css";
import Sidebar from "../components/Sidebar";
import { Trash3 } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const JobTypes = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillIncr, setSkillIncr] = useState([]);

  const selected = jobs.find(job=> job.id === selectedId);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/trinity/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.log(err));
  }, []);

  const updateField = (field, value) => {
    setJobs((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSkillUpdate = async () => {
    try {
      const response = await fetch(
        `/trinity/api/jobtypes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selected.id,
            name: selected.type,
            skills: selectedSkills,
            skillI: skillIncr,
            min_staff: selected.min_staff
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to update skills");
      }

      await response.json();
      fetch("/trinity/api/jobs")
        .then(res => res.json())
        .then(data => setJobs(data));
    } catch (error) {
      console.error("Error updating skills:", error);
    }
  };


  const handleDelete = async (id)=>{
    await fetch(`/trinity/api/jobtypes/${id}`, {
      method: "DELETE",
    })
    setJobs(prev => prev.filter(j => j.id !== id));
  }
  const handleChange = (e) => {
  const values = Array.from(e.target.selectedOptions, option => option.value);
  setSelectedSkills(values);  
  };

  const handleChange1 = (e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setSkillIncr(values);
  }


  return (
    <div className="jobtypes-container">
      <Sidebar />

      <div className="jobtypes-content">
        {/* Page Title */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <h1 className="jobtypes-title">Job Types</h1>
        <Button className="mb-2" style={{position:"end"}} onClick={()=>{navigate("/addJT")}}>Add Job Type</Button>
        </div>

        <div className="jobtypes-grid">
          {/* LEFT COLUMN – Job Type List */}
          <div className="jobtypes-list-card">

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search job types..."
              className="jobtypes-search"
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Job Type Items */}
            <div className="jobtypes-list">
              {jobs.filter((jt) => jt.type.toLowerCase().includes(search.toLowerCase())).map((jt) => (
                <div
                  key={jt.id}
                  className={`jobtype-item ${selectedId === jt.id ? "active" : ""
                    }`}
                  onClick={() => setSelectedId(jt.id)}
                >
                  <span className="jobtype-item-icon">⚡</span>
                  {jt.type}
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
                  <h2>Editing: {selected.type}</h2>

                  <Trash3 size={20} className="delete-icon" onClick={()=>{handleDelete(selected.id)}}/>
                </div>

                {/* Job Type Name */}
                <label className="field-label">Job Type Name</label>
                <input
                  type="text"
                  className="field-input"
                  value={selected.type}
                  onChange={(e) => updateField("type", e.target.value)}
                />

                {/* Required Skills */}
                <label className="field-label">Required Skills</label>
                <div className="skills-box">
                  <select required multiple onChange={handleChange} value={selectedSkills}>
                    {Object.keys(selected)
                      .filter(key => Number.isInteger(selected[key]) && selected[key] > 0)
                      .filter(key => !["id", "min_staff"].includes(key))
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                </div>

                <label className="field-label">Add Skills</label>
                <div className="skills-box">
                  <select required multiple onChange={handleChange1} value={skillIncr}>
                  {Object.keys(selected)
                    .filter(key => !isNaN(selected[key]))
                    .filter(key => !["id", "min_staff"].includes(key))
                    .map((s, index) => (
                    <option key={index} value={s} disabled={s === "id" || s === "min_staff"}>
                      {s}
                    </option>
                  ))}
                  </select>
                </div>

                <p className="note-text">
                  These skills will be automatically suggested for new jobs of
                  this type.(use shift-click to select multiple)(select skills to be removed.)
                </p>

                {/* Min Staff + Duration */}
                <div className="two-col">
                  <div>
                    <label className="field-label">Minimum Staff</label>
                    <input
                      type="number"
                      className="field-input"
                      value={selected.min_staff}
                      onChange={(e) => updateField("min_staff", e.target.value)}
                    />
                  </div>

                  {/* <div>
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
                  </div>*/}
                </div>


                {/* Status Toggle */}
                {/* <label className="field-label">Status</label>
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
                </div> */}

                {/* Buttons */}
                <div className="button-row">
                  <button className="cancel-btn">Cancel</button>
                  <button className="save-btn" onClick={handleSkillUpdate}>Save Changes</button>
                </div>
              </>
            ) : (
              <p>Select a job type to edit...</p>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default JobTypes;
