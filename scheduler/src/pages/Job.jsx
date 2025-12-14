import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // <-- ADDED
import "./Job.css";

import Sidebar from "../components/Sidebar";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [sjobs, setSjobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editJob, setEditJob] = useState(null); 
  const [editForm, setEditForm] = useState({
    address: "",
    type: "",
    client: "",
    status: "",
    start_date: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredJobs = sjobs.filter((sj) => {
    if (!searchTerm) return true; 

    const term = searchTerm.toLowerCase();

    return (
      sj.id.toLowerCase().includes(term) ||
      sj.address.toLowerCase().includes(term) ||
      sj.client.toLowerCase().includes(term)
    );
  });

  const navigate = useNavigate();  
  useEffect(() => {
    fetch("http://localhost:8000/scheduledjobs")
      .then(res => res.json())
      .then(data => setSjobs(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/jobTypes")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/employeeNames")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/jobTypes")
      .then((res) => res.json())
      .then((data) => setJobTypes(data))
      .catch((err) => console.log(err));
  }, []);

  const handleEdit = (id) =>{
      const job = sjobs.find(j => j.id === id);
      setEditJob(job);

      setEditForm({
        address: job.address,
        type:job.type,
        client: job.client,
        status: job.status,
        start_date: job.start_date
      });
  }

  const handleDelete = (id) =>{
    fetch(`http://localhost:8000/scheduledjobs/${id}`, {
      method: "DELETE",
    }).then(()=>(setSjobs(prev => prev.filter(job => job.id !== id))));
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8000/scheduledjobs/${editJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(updated => {
        setSjobs(prev =>
          prev.map(j => (j.id === editJob.id ? { ...j, ...editForm } : j))
        );

        setEditJob(null);         
      })
      .catch(err => console.error(err));
  };
  return (
    <div className="d-flex w-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        <Container fluid>
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <h1 className="page-title mb-1">Job Management</h1>
              <p className="text-muted">Create, edit, and track active jobs.</p>
            </Col>

            <Col xs="auto">
              <Button variant="primary" onClick={() => navigate("/cjautomated")}>
                <span className="material-symbols-outlined"></span> Create New Job
              </Button>
            </Col>
          </Row>

          {/* Search + Filter */}
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <span className="material-symbols-outlined search-icon">search</span>
                <Form.Control placeholder="Search by Job ID, Address, or Client Name" value={searchTerm} onChange={(e)=>(setSearchTerm(e.target.value))} />
              </InputGroup>
            </Col>

            <Col md={6} className="d-flex justify-content-end gap-2">
              <DropdownButton title="Status" variant="outline-secondary">
                <Dropdown.Item>Completed</Dropdown.Item>
                <Dropdown.Item>In Progress</Dropdown.Item>
                <Dropdown.Item>Scheduled</Dropdown.Item>
              </DropdownButton>

              <DropdownButton title="Staff" variant="outline-secondary">
                {employees.map((emp, index) => (
                  <Dropdown.Item key={index}>{emp}</Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton title="Job Type" variant="outline-secondary">
                {jobs.map((job, index) => (
                  <Dropdown.Item key={index}>{job}</Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton title="Date Range" variant="outline-secondary">
                <Dropdown.Item>Last 7 Days</Dropdown.Item>
                <Dropdown.Item>Last 30 Days</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>

          {/* Table */}
          <Row className="mb-4">
            <Col>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Client</th>
                    <th>Assigned Staff ID</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.map((sj,idx)=>(
                  <tr key={idx}>
                    <td>{sj.id}</td>
                    <td>{sj.address}</td>
                    <td>{sj.type}</td>
                    <td>{sj.client}</td>
                    <td>{sj.assigned.join(', ')}</td>
                    <td>{sj.start_date}</td>
                    <td><span className={
                            sj.status === "Completed" ? "badge bg-success" :
                            sj.status === "Scheduled" ? "badge bg-primary" :
                            sj.status === "In Progress" ? "badge bg-warning text-dark" :
                            "badge bg-secondary"
                          }>{sj.status}
                        </span>
                    </td>
                    <td className="text-end">
                      <DropdownButton title="actions" variant="outline-secondary">
                        <Dropdown.Item onClick={()=>(handleEdit(sj.id))}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={()=>(handleDelete(sj.id))}>Delete</Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
        {editJob && (
          <div className="edit-overlay">
            <div className="edit-card p-4 bg-white shadow rounded">
              <h3>Edit Job {editJob.id}</h3>

              <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                  >
                    {jobTypes.map((jt,idx)=>(
                      <option key={idx} value={jt}>{jt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Client</Form.Label>
                  <Form.Control
                    value={editForm.client}
                    onChange={(e) =>
                      setEditForm({ ...editForm, client: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.start_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, start_date: e.target.value })
                    }
                  />
                </Form.Group>

                <Button type="submit" className="btn btn-primary me-2">
                  Save Changes
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setEditJob(null)}
                >
                  Cancel
                </Button>
              </Form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Job;
