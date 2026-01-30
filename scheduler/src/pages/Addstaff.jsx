import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./AddStaff.css";

const AddStaff = () => {
  const [skillOptions ,setSO] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  skills: {},
});
  // useEffect(()=>{
  //     fetch("http://localhost:8000/skills")
  //         .then(res=>res.json())
  //         .then(data=>setSO(data))
  //         .catch(err => console.log(err));
  // },[])

  // prabhat's
  useEffect(() => {
    fetch("http://localhost:8000/skills")
      .then(res => res.json())
      .then(data => {
        setSO(data);

        // initialize skills dynamically AFTER fetch
        const initialSkills = {};
        data.forEach(skill => {
          initialSkills[skill.name] = 0; // X by default
        });

        setFormData(prev => ({
          ...prev,
          skills: initialSkills
        }));
      })
      .catch(err => console.log(err));
  }, []);


  const dropdownValues = [
    { value: 0, label: "X - Not an Option" },
    { value: 3, label: "A - Best Option" },
    { value: 2, label: "B - Second Option" },
    { value: 1, label: "C - Last Option" },
  ];

  // const [formData, setFormData] = useState({
    
  //   name: "",
  //   email: "",
  //   skills: skillOptions.reduce((acc, skill) => {
  //     acc[skill] = "X";
  //     return acc;
  //   }, {}),
  // });

  // prabhat's


  // prabhat's change(delete fcn step 2)
  // const [staffList, setStaffList] = useState([]);


  const handleSkillChange = (skill, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [skill]: value },
    }));
  };

  // const handleSubmit = () => {
  //   console.log(formData);
  //   alert("Staff Created Successfully!");
  // };


  // prabhat's change
  // const handleSubmit = async () => {
  //   const payload = {
  //     name: formData.name,
  //     email: formData.email,

  //     teamlead: Number(formData.skills["Team Lead"]),
  //     lister: Number(formData.skills["Lister"]),
  //     mover_packer: Number(formData.skills["Mover/Packer"]),
  //     cleaner: Number(formData.skills["Cleaner"]),
  //     truck_driver: Number(formData.skills["Truck Driver"]),
  //     car_driver: Number(formData.skills["Car Driver"]),
  //   };

  //   try {
  //     const res = await fetch("http://localhost:8000/employees", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) throw new Error("Failed to create staff");

  //     alert("Staff Created Successfully!");
  //     fetchStaff();

  //   } catch (err) {
  //     console.error(err);
  //     alert("Error creating staff");
  //   }
  // };

  // prabhat's
  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      email: formData.email,
    };

    // attach skills dynamically
    Object.keys(formData.skills).forEach(skill => {
      payload[skill] = Number(formData.skills[skill]);
    });

    try {
      const res = await fetch("http://localhost:8000/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        throw new Error("Failed to create staff");
      }

      alert("Staff Created Successfully!");
      // fetchStaff();
      navigate('/staff')
    } catch (err) {
      console.error(err);
      alert("Error creating staff");
    }
  };


  // prabhst's settings step 4
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this staff?")) return;

  //   try {
  //     const res = await fetch(`http://localhost:8000/employees/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (!res.ok) throw new Error();

  //     alert("Staff deleted!");
  //     setStaffList((prev) => prev.filter((s) => s.id !== id));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Delete failed");
  //   }
  // };



  // prabhat's delete step 3
  // useEffect(() => {
  //   fetchStaff();
  // }, []);

  // const fetchStaff = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8000/employees");
  //     const data = await res.json();
  //     setStaffList(data);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error fetching staff");
  //   }
  // };




  return (
    <div className="cj-layout">
      <Sidebar />

      <div className="cj-content">
        <h1 className="cj-title">Add New Staff</h1>
        <p className="cj-subtitle">
          Enter the details below to create a new team member.
        </p>

        {/* Employee Details */}
        <div className="cj-card">
          <h3 className="cj-section-title">Employee Details</h3>

          <div className="cj-grid-2">
            <div className="cj-field">
              <label>
                Employee Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="cj-field">
              <label>
                Email Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

          </div>
        </div>

        {/* Skill Section */}
        <div className="cj-card">
          <h3 className="cj-section-title">Skillset & Ranking</h3>

          {skillOptions.map((skill) => (
            <div className="cj-field" key={skill.id}>
              <label>{skill.name}</label>
              <select
                value={formData.skills[skill.name] ?? 0}
                onChange={(e) => handleSkillChange(skill.name, e.target.value)}
              >
                {dropdownValues.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="cj-bottom-btn-wrapper">
          <button className="cj-btn-primary" onClick={handleSubmit}>
            + Create Staff
          </button>
        </div>


        {/* prabhat's delete */}

        {/* <div className="cj-card">
          <h3 className="cj-section-title">Staff List</h3>

          <table className="cj-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>TL</th>
                <th>Lister</th>
                <th>MP</th>
                <th>Cleaner</th>
                <th>Truck</th>
                <th>Car</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {staffList.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.teamlead}</td>
                  <td>{s.lister}</td>
                  <td>{s.mover_packer}</td>
                  <td>{s.cleaner}</td>
                  <td>{s.truck_driver}</td>
                  <td>{s.car_driver}</td>
                  <td>
                    <button
                      className="cj-btn-danger"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}



      </div>
    </div>
  );
};

export default AddStaff;
