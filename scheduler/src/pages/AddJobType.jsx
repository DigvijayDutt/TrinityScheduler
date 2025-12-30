import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./AddSkills.css";

function addJT(){
    const navigate = useNavigate();
    const [skills,setskills] = useState([]);
    const [formData, setFormData] = useState({
        jobTypeName: "",
        minimumStaff: 0,
        requiredSkills: [],
    });
    useEffect(()=>{
        fetch("http://localhost:8000/skills")
            .then(res=>res.json())
            .then(data=>setskills(data))
            .catch(err => console.log(err));
    },[])
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    /* Handle multi-select skills */
    const handleSkillsChange = (e) => {
        const selectedValues = Array.from(
        e.target.selectedOptions,
        (option) => option.value
        );

        setFormData((prev) => ({
        ...prev,
        requiredSkills: selectedValues,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/jobtypes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Job Type created:", data);
        })
        .then(() => navigate('/jobtypes'))
        .catch((err) => console.error("Error:", err));
    };
    return(
        <div className="cj-layout">
            <Sidebar />
            <div className="cj-content">
                <h1 className="cj-title">Add Job Type</h1>
                <p className="cj-subtitle">
                    Create a new job type and define its requirements
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="cj-card">
                    <h2 className="cj-section-title">Job Type Details</h2>

                    <div className="cj-grid-2">
                        {/* Job Type Name */}
                        <div className="cj-field">
                        <label>Job Type Name</label>
                        <input
                            type="text"
                            name="jobTypeName"
                            placeholder="Enter job type name"
                            value={formData.jobTypeName}
                            onChange={handleChange}
                            required
                        />

                        </div>

                        {/* Minimum Staff */}
                        <div className="cj-field">
                        <label>Minimum Staff</label>
                        <input
                            type="number"
                            name="minimumStaff"
                            min="1"
                            placeholder="Enter minimum staff required"
                            value={formData.minimumStaff}
                            onChange={handleChange}
                            required
                        />
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className="cj-field">
                        <label>Required Skills</label>
                        <select required multiple value={formData.requiredSkills} onChange={handleSkillsChange}>
                            <option value="">Select required skill</option>
                            {skills.map((skill)=>(
                                <option key={skill.id} value={skill.name}>{skill.name}</option>
                            ))}
                        </select>
                    </div>
                    </div>

                    {/* Submit Button */}
                    <div className="cj-bottom-btn-wrapper">
                    <button type="submit" className="cj-btn-primary">
                        Save Job Type
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default addJT;