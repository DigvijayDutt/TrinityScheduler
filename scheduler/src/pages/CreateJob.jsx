import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // <-- using your existing sidebar
import "./createjob.css";

const CreateJob = () => {
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

  useEffect(() => {
    fetch("http://localhost:8000/jobTypes")
      .then(res => res.json())
      .then(data => setJobTypes(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="cj-layout">
      <Sidebar />

      <div className="cj-content">
        <h2 className="cj-title">Create a New Job</h2>
        <p className="cj-subtitle">Fill in the details below to schedule a new job.</p>

        {/* JOB DETAILS */}
        <div className="cj-card">
          <h3 className="cj-section-title">Job Details</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Type of Job</label>
              <select>
                {jobTypes.map((jobType, index) => (
                  <option key={index}>{jobType}</option>
                ))}
              </select>
            </div>

            <div className="cj-field">
              <label>Type of Loss</label>
              <select>
                {lossTypes.map((lossType, index) => (
                  <option key={index}>{lossType.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Client</label>
              <select>
                {clients.map((client, index) => (
                  <option key={index}>{client.name}</option>
                ))}
              </select>
            </div>

            <div className="cj-field">
              <label>Project Manager</label>
              <select>
                {projectManagers.map((projectManager, index) => (
                  <option key={index}>{projectManager.name}</option>
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
            <input type="text" placeholder="Start typing address…" />
          </div>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Time</label>
              <input type="datetime-local" />
            </div>

            <div className="cj-field">
              <label>Vehicle</label>
              <select>
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
              <input type="number" placeholder="e.g., 2" />
            </div>

            <div className="cj-field">
              <label>Maximum Staff</label>
              <input type="number" placeholder="e.g., 4" />
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO */}
        <div className="cj-card">
          <h3 className="cj-section-title">Additional Information</h3>

          <div className="cj-field">
            <label>Special Instructions</label>
            <textarea placeholder="Enter any special instructions..." rows={4}></textarea>
          </div>
        </div>

        <div className="cj-bottom-btn-wrapper">
          <button className="cj-btn-primary">Create Job</button>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
