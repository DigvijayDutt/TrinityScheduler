import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import "./createjob.css";

const CreateJob = () => {
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState([
    { id: 1, name: "Vehicle 1" },
    { id: 2, name: "Vehicle 2" },
    { id: 3, name: "Vehicle 3" },
    { id: 4, name: "Vehicle 4" },
    { id: 5, name: "Vehicle 5" },
  ]);
  const [jobTypes, setJobTypes] = useState([]);
  const [lossTypes, setLossTypes] = useState([
    { id: 1, name: "Loss Type 1" },
    { id: 2, name: "Loss Type 2" },
    { id: 3, name: "Loss Type 3" },
    { id: 4, name: "Loss Type 4" },
    { id: 5, name: "Loss Type 5" },
  ]);
  const [clients, setClients] = useState([
    { id: 1, name: "Client 1" },
    { id: 2, name: "Client 2" },
    { id: 3, name: "Client 3" },
    { id: 4, name: "Client 4" },
    { id: 5, name: "Client 5" },
  ]);
  const [projectManagers, setProjectManagers] = useState([
    { id: 1, name: "Project Manager 1" },
    { id: 2, name: "Project Manager 2" },
    { id: 3, name: "Project Manager 3" },
    { id: 4, name: "Project Manager 4" },
    { id: 5, name: "Project Manager 5" },
  ]);
  const [emps, setEmps] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedJT, setSelectedJT] = useState("Small Pack out / Move (no listing)");
  const [jobs,setJobs] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/jobTypes")
      .then(res => res.json())
      .then(data => setJobTypes(data))
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/employees")
      .then(res => res.json())
      .then(data => setEmps(data))
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.log(err));
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.assigned = formData.getAll("assigned");

    fetch("http://localhost:8000/scheduledjobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    navigate('/jobs')
  };
  return (
    <div className="cj-layout">
      <Sidebar />

      <form className="cj-content" onSubmit={handleSubmit}>
        <h2 className="cj-title">Create a New Job</h2>
        <p className="cj-subtitle">Fill in the details below to schedule a new job.</p>

        {/* JOB DETAILS */}
        <div className="cj-card">
          <h3 className="cj-section-title">Job Details</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Type of Job</label>
              <select name="jobType" onChange={(e)=>(setSelectedJT(e.target.value))}>
                {jobTypes.map((jobType, index) => (
                  <option key={index} value={jobType}>{jobType}</option>
                ))}
              </select>
            </div>

            <div className="cj-field">
              <label>Job ID</label>
              <select name="lossType">
                {lossTypes.map((lossType, index) => (
                  <option key={index} value={lossType.name}>{lossType.name}</option>
                ))}
              </select>
            </div>

            <div className="cj-field">
              <label>Type of Loss</label>
              <select name="lossType">
                {lossTypes.map((lossType, index) => (
                  <option key={index} value={lossType.name}>{lossType.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Client</label>
              <select name="client">
                {clients.map((client, index) => (
                  <option key={index} value={client.name}>{client.name}</option>
                ))}
              </select>
            </div>

            <div className="cj-field">
              <label>Project Manager</label>
              <select name="projectManager">
                {projectManagers.map((pm, index) => (
                  <option key={index} value={pm.name}>{pm.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* LOGISTICS */}
        <div className="cj-card">
          <h3 className="cj-section-title">Logistics</h3>

          <div className="cj-field">
            <label>Address</label>
            <input type="text" name="address" placeholder="Start typing address…" />
          </div>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Time</label>
              <input type="date" name="time" />
            </div>

            <div className="cj-field">
              <label>Vehicle</label>
              <select name="vehicle">
                <option>Select a vehicle</option>
              </select>
            </div>
          </div>
        </div>

        {/* STAFFING */}
        <div className="cj-card">
          <h3 className="cj-section-title">Staffing</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Minimum Staff</label>
              <input type="number" name="minStaff" placeholder="e.g., 2" />
              <select name="assigned" multiple size="6" onChange={(e)=>{
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedEmployees(values);
              }}>
                {emps.map((emp,idx)=>(
                  <option key={idx} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div className="cj-field">
              <label>Maximum Staff</label>
              <input type="number" name="maxStaff" placeholder="e.g., 4" />
                {selectedEmployees.length > 0 && (
                  <p>Selected: {selectedEmployees.join(", ")}</p>
                )}
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO */}
        <div className="cj-card">
          <h3 className="cj-section-title">Additional Information</h3>

          <div className="cj-field">
            <label>Special Instructions</label>
            <textarea
              name="specialInstructions"
              placeholder="Enter any special instructions..."
              rows={4}
            ></textarea>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="cj-bottom-btn-wrapper">
          <button type="submit" className="cj-btn-primary">Create Job</button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
