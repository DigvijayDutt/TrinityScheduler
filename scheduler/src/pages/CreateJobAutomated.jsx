import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Createjob.css";

const CreateJobAutomated = () => {
  const navigate = useNavigate();
  const [busyEmps, setBusyEmps] = useState([]);


  // const [vehicle, setVehicle] = useState([
  //   { id: 1, name: "Vehicle 1" },
  //   { id: 2, name: "Vehicle 2" },
  //   { id: 3, name: "Vehicle 3" },
  //   { id: 4, name: "Vehicle 4" },
  //   { id: 5, name: "Vehicle 5" },
  // ]);
  const [jobTypes, setJobTypes] = useState([]);
  // const [lossTypes, setLossTypes] = useState([
  //   { id: 1, name: "Loss Type 1" },
  //   { id: 2, name: "Loss Type 2" },
  //   { id: 3, name: "Loss Type 3" },
  //   { id: 4, name: "Loss Type 4" },
  //   { id: 5, name: "Loss Type 5" },
  // ]);
  // const [clients, setClients] = useState([
  //   { id: 1, name: "Client 1" },
  //   { id: 2, name: "Client 2" },
  //   { id: 3, name: "Client 3" },
  //   { id: 4, name: "Client 4" },
  //   { id: 5, name: "Client 5" },
  // ]);
  const [projectManagers, setProjectManagers] = useState([
    { id: 1, name: "Project Manager 1" },
    { id: 2, name: "Project Manager 2" },
    { id: 3, name: "Project Manager 3" },
    { id: 4, name: "Project Manager 4" },
    { id: 5, name: "Project Manager 5" },
  ]);
  const [jobDate, setJobDate] = useState("");
  // const [busyEmps, setBusyEmps] = useState([]);


  // employees from backend: expected shape { name: string, skill1: number, skill2: number, ... }
  const [emps, setEmps] = useState([]);

  // jobs from backend: expected shape { type: string, skill1: number, skill2: number, ... }
  const [jobs, setJobs] = useState([]);

  // current selection + filtered employees who meet the requirements
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedJT, setSelectedJT] = useState(
    "Small Pack out / Move (no listing)"
  );
  const [filteredEmps, setFilteredEmps] = useState([]);

  // prabhat's
  const [errorMessage, setErrorMessage] = useState("");


  // fetch job types (strings) to populate the jobType select
  // useEffect(() => {
  //   fetch("http://localhost:8000/busystaff")
  //     .then(res => res.json())
  //     .then(data => setBusyEmps(data))
  //     .catch(() => setBusyEmps([]));
  // }, []);
  useEffect(() => {
    if (!jobDate) {
      setBusyEmps([]);
      return;
    }

    fetch(`http://localhost:8000/busystaff/${jobDate}`)
      .then(res => res.json())
      .then(data => setBusyEmps(data))
      .catch(err => console.log(err));
  }, [jobDate]);


  useEffect(() => {
    fetch("http://localhost:8000/jobTypes")
      .then((res) => res.json())
      .then((data) => setJobTypes(data))
      .catch((err) => console.log(err));
  }, []);

  // fetch employees (array of objects)
  useEffect(() => {
    fetch("http://localhost:8000/employees")
      .then((res) => res.json())
      .then((data) => setEmps(data))
      .catch((err) => console.log(err));
  }, []);

  // fetch jobs (array of objects containing requirements per job type)
  useEffect(() => {
    fetch("http://localhost:8000/jobs/normalized")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.log(err));
  }, []);


  // whenever jobs, emps, or selected job type changes, compute which employees meet requirements
  useEffect(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      setFilteredEmps([]);
      return;
    }

    const sel = (selectedJT ?? "").toString().trim().toLowerCase();

    const jobReq = jobs.find(j =>
      (j.type ?? "").toString().trim().toLowerCase() === sel
    );

    if (!jobReq) {
      setFilteredEmps([]);
      return;
    }

    // const skillKeys = ["teamlead", "lister", "mover_packer", "cleaner", "truck_driver", "car_driver"];

    // const requirementEntries = skillKeys
    //   .map(k => [k, Number(jobReq[k] ?? 0)])
    //   .filter(([_, v]) => Number.isFinite(v) && v > 0);
    const requirementEntries = Object.entries(jobReq.skills || {});


    // Relaxed eligibility: at least ONE skill matches
    // const matched = (emps || []).filter(emp => {

    //   return requirementEntries.some(([skill, required]) => {
    //     const empVal = Number(emp[skill] ?? 0);
    //     return empVal >= required;
    //   });
    // });
    const matched = (emps || []).filter(emp => {

      // 🚫 exclude busy employees
      if (busyEmps.includes(emp.id)) return false;

      return requirementEntries.some(([skill, required]) => {
        const empVal = Number(emp[skill] ?? 0);
        return empVal >= required;
      });
    });


    // Score employees
    const scored = matched
      .map(emp => {
        const score = requirementEntries.reduce((acc, [skill, required]) => {
          return acc + (Number(emp[skill] ?? 0) >= required ? 1 : 0);
        }, 0);
        return { ...emp, _score: score };
      })
      .sort((a, b) => b._score - a._score);

    const requiredCount = Number(jobReq.min_staff ?? 0);
    const limited = requiredCount > 0
      ? scored.slice(0, requiredCount)
      : scored;

    // setFilteredEmps(limited);
    // setSelectedEmployees(prev =>
    //   prev.filter(id => limited.some(m => m.id === id))
    // );
    setFilteredEmps(emps); // show all employees in the checkbox list
    setSelectedEmployees(limited.map(e => e.id)); // tick only recommended employees


  }, [jobs, emps, selectedJT, busyEmps]);

  // useEffect(() => {
    // if (filteredEmps.length > 0 && selectedEmployees.length === 0) {
      // setSelectedEmployees(filteredEmps.map(e => e.id));
    // }
  // }, [filteredEmps]);

  // Handle form submit - same as before, assigned will be the multi-select values
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const formData = new FormData(e.target);
  //   const data = Object.fromEntries(formData.entries());
  //   data.assigned = formData.getAll("assigned").map(Number);

  //   fetch("http://localhost:8000/scheduledjobs", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   })
  //     .then(() => navigate("/jobs"))
  //     .catch((err) => {
  //       console.error(err);
  //       navigate("/jobs"); // still navigate, or consider keeping user on page on error
  //     });
  // };

      // prabhat's
      const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.assigned = formData.getAll("assigned").map(Number);

        fetch("http://localhost:8000/scheduledjobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(async (res) => {
            const result = await res.json();

            if (!res.ok) {
              // Backend returned an error
              setErrorMessage(result.detail || "Employee is already assigned on this date");
            } else {
              navigate("/jobs"); // job created successfully
            }
          })
          .catch((err) => {
            console.error(err);
            setErrorMessage("Something went wrong while creating the job.");
          });
      };


  return (
    <div className="cj-layout">
      <Sidebar />

        {/* prabhat's change */}
        {errorMessage && (
          <div style={{ margin: "10px 20px" }}>
            <div className="alert alert-danger alert-dismissible" role="alert">
              {errorMessage}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setErrorMessage("")}
              ></button>
            </div>
          </div>
        )}



      <form className="cj-content" onSubmit={handleSubmit}>
        <h2 className="cj-title">Create a New Job</h2>
        <p className="cj-subtitle">Fill in the details below to schedule a new job.</p>

        {/* JOB DETAILS */}
        <div className="cj-card">
          <h3 className="cj-section-title">Job Details</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Type of Job</label>
              <select
                name="jobType"
                value={selectedJT}
                onChange={(e) => setSelectedJT(e.target.value)}
              >
                {/* jobTypes might be an array of strings */}
                {jobTypes.map((jobType, index) => (
                  <option key={index} value={jobType}>
                    {jobType}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="cj-field">
              <label>Type of Loss</label>
              <select name="lossType">
                {lossTypes.map((lossType, index) => (
                  <option key={index} value={lossType.name}>
                    {lossType.name}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="cj-field">
              <label>
                Type of Loss <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="lossType"
                placeholder="Enter loss type"
                required
              />
            </div>



          </div>

          <div className="cj-grid-2">
            {/* <div className="cj-field">
              <label>Client</label>
              <select name="client">
                {clients.map((client, index) => (
                  <option key={index} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="cj-field">
              <label>
                Client <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="client"
                placeholder="Enter client name"
                required
              />
            </div>



            <div className="cj-field">
              <label>Project Manager</label>
              <select name="projectManager">
                {projectManagers.map((pm, index) => (
                  <option key={index} value={pm.name}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* LOGISTICS */}
        <div className="cj-card">
          <h3 className="cj-section-title">Logistics</h3>

          <div className="cj-field">
            <label>
              Address <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Start typing address…"
              required
            />
          </div>


          <div className="cj-grid-2">
            <div className="cj-field">
              <label>Time</label>
              {/* <input type="date" name="time" /> */}
              <input
                type="date"
                name="time"
                value={jobDate}
                onChange={(e) => setJobDate(e.target.value)}
              />

            </div>

            {/* <div className="cj-field">
              <label>Vehicle</label>
              <select name="vehicle">
                <option>Select a vehicle</option>
                {vehicle.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="cj-field">
              <label>
                Vehicle <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="vehicle"
                placeholder="Enter vehicle details"
                required
              />
            </div>


          </div>
        </div>

        {/* STAFFING */}
        <div className="cj-card">
          <h3 className="cj-section-title">Staffing</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label style={{ marginTop: 8, display: "block", fontSize: 14 }}>
                Assign Employees (only those meeting the job requirements)
              </label>

              <div
                style={{
                  maxHeight: 180,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 6
                }}
              >
                {filteredEmps.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#666" }}>
                    No employees meet the requirements
                  </div>
                ) : (
                  filteredEmps.map((emp) => (
                    <label
                      key={emp.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assigned"                 
                        value={emp.id}
                        checked={selectedEmployees.includes(emp.id)} 
                        onChange={(e) => {
                          const empId = emp.id;

                          setSelectedEmployees((prev) =>
                            e.target.checked
                              ? [...prev, empId]                
                              : prev.filter((id) => id !== empId) 
                          );
                        }}
                      />
                      <span>{emp.name}</span>
                    </label>
                  )))
                }
              </div>
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
          <button type="submit" className="cj-btn-primary">
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobAutomated;
