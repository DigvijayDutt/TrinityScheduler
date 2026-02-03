import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Job from "./pages/Job";
import Staff from "./pages/Staff";
import JobTypes from "./pages/Jobtypes";
import Skills from "./pages/Skills";
import CreateJob from "./pages/CreateJob";
import Settings from "./pages/Settings";  // ⬅️ Added import for Settings
import AddStaff from "./pages/Addstaff";
import CreateJobAutomated from "./pages/CreateJobAutomated";
import AddSkills from "./pages/Addskills";
import AddJT from "./pages/AddJobType";
import JobDetails from "./pages/JobDetails";
import EditStaff from "./pages/EditStaff";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";



function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/createjob" element={<CreateJob />} />
        <Route path="/cjautomated" element={<CreateJobAutomated />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/jobtypes" element={<JobTypes />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/settings" element={<Settings />} />  {/* NEW SETTINGS ROUTE */}
        <Route path="/addstaff" element={<AddStaff />} />  
        <Route path="/addskills" element={<AddSkills />} />  
        <Route path="/addJT" element={<AddJT />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/editstaff/:id" element={<EditStaff />} />


      </Routes>
  );
}

export default App;
