import React from "react";
import Sidebar from "../components/Sidebar"; // <-- using your existing sidebar
import "./createjob.css";

const CreateJob = () => {
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
                <option>Select job type</option>
              </select>
            </div>

            <div className="cj-field">
              <label>Type of Loss</label>
              <select>
                <option>Select loss type</option>
              </select>
            </div>
          </div>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Client</label>
              <select>
                <option>Search and select a client</option>
              </select>
            </div>

            <div className="cj-field">
              <label>Project Manager</label>
              <select>
                <option>Select a project manager</option>
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
