import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Job from "./pages/Job";
import Staff from "./pages/Staff";
import JobTypes from "./pages/Jobtypes";
import Skills from "./pages/Skills";
import CreateJob from "./pages/CreateJob";
import Settings from "./pages/Settings";  // ⬅️ Added import for Settings
import AddStaff from "./pages/Addstaff";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/createjob" element={<CreateJob />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/jobtypes" element={<JobTypes />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/settings" element={<Settings />} />  {/* NEW SETTINGS ROUTE */}
        <Route path="/addstaff" element={<AddStaff />} />  

      </Routes>
    </Router>
  );
}

export default App;
