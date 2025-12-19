import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import JobCalendar from "../components/JobCalendar";

function Dashboard() {
  const navigate = useNavigate()
  const [jobno, setJobno] = useState(0);
  const [staffno, setStaffno] = useState(0);
  const [busy, setBusystaff] = useState([]);
  const busyID = [...new Set(busy)]
  useEffect(()=>{
    fetch("http://localhost:8000/scheduledjobs")
      .then((res)=> res.json())
      .then((data) => setJobno(Array.isArray(data) ? data.length : 0))
      .catch((err)=>console.log(err));
  }, []);
  useEffect(()=>{
    fetch("http://localhost:8000/employees")
      .then((res)=> res.json())
      .then((data) => setStaffno(Array.isArray(data) ? data.length : 0))
      .catch((err)=>console.log(err));
  }, []);
  useEffect(()=>{
    fetch("http://localhost:8000/busystaff")
      .then((res)=> res.json())
      .then((data) => setBusystaff(data))
      .catch((err)=>console.log(err));
  }, []);
  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="main-content flex-grow-1">
        <div className="dashboard-header">
          <h1>Dashboard</h1>

          <div className="legend">
            <span className="dot blue"></span> Upcoming
            <span className="dot yellow"></span> Ongoing
            <span className="dot green"></span> Completed
          </div>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="card">
            <h3>Total Jobs</h3>
            <p className="number">{jobno}</p>
            <button onClick={()=>(navigate("/jobs"))}>Manage Jobs</button>
          </div>

          <div className="card">
            <h3>Staff Overview</h3>
            <p className="number">{staffno}</p>
            <button onClick={()=>(navigate("/staff"))}>Manage Staff</button>
          </div>

          <div className="card">
            <h3>Busy Staff</h3>
            <p className="number">{busyID.length}</p>
            <button onClick={()=>(navigate("/staff"))}>Manage Types</button>
          </div>

          <div className="card">
            <h3>Available Staff</h3>
            <p className="number">{(staffno - busyID.length)}</p>
            <button onClick={()=>(navigate("/skills"))}>Manage Skills</button>
          </div>
        </div>

        {/* REAL Calendar */}
        <div className="calendar-section">
          <JobCalendar />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
