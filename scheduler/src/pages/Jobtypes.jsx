// src/pages/JobTypes.jsx
import React, { useState, useEffect } from "react";
import "./jobtypes.css";
import Sidebar from "../components/Sidebar";
import { Trash3 } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillIncr, setSkillIncr] = useState([]);

  const selected = jobs[selectedId];

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.log(err));
  }, []);

  const updateField = (field, value) => {
    setJobs((prev) =>
      prev.map((item) =>
        jobs.indexOf(item) === selectedId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSkillUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/jobtypes/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selected.type,
            skills: selectedSkills,
            skillI: skillIncr
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to update skills");
      }

      const data = await response.json();
      console.log("Update successful:", data);

      window.location.reload();
    } catch (error) {
      console.error("Error updating skills:", error);
    }
  };


  const handleDelete = async (id)=>{
    await fetch(`http://localhost:8000/jobtypes/${id}`, {
      method: "DELETE",
    })
    setJobs(prev => prev.filter(j => j.type !== id));
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
              {jobs.filter((jt) => jt.type.toLowerCase().includes(search.toLowerCase())).map((jt, index) => (
                <div
                  key={index}
                  className={`jobtype-item ${selectedId === index ? "active" : ""
                    }`}
                  onClick={() => setSelectedId(index)}
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

                  <Trash3 size={20} className="delete-icon" onClick={()=>{handleDelete(selected.type)}}/>
                </div>

                {/* Job Type Name */}
                <label className="field-label">Job Type Name</label>
                <input
                  type="text"
                  className="field-input"
                  value={selected.type}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                {/* Required Skills */}
                <label className="field-label">Required Skills</label>
                <div className="skills-box">
                  <select required multiple onChange={handleChange} value={selectedSkills}>
                  {Object.keys(selected).filter(key => selected[key] !== 0 && !isNaN(selected[key])).splice(0, Object.keys(selected).length).map((s, index) => (
                    <option key={index} value={s}>
                      {s}
                    </option>
                  ))}
                  </select>
                </div>

                <label className="field-label">Add Skills</label>
                <div className="skills-box">
                  <select required multiple onChange={handleChange1} value={skillIncr}>
                  {Object.keys(selected).splice(1, Object.keys(selected).length - 1).map((s, index) => (
                    <option key={index} value={s}>
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
