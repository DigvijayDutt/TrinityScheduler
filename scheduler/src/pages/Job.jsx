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
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();   // <-- ADDED

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
              <Button variant="primary" onClick={() => navigate("/createjob")}>
                <span className="material-symbols-outlined"></span> Create New Job
              </Button>
            </Col>
          </Row>

          {/* Search + Filter */}
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <span className="material-symbols-outlined search-icon">search</span>
                <Form.Control placeholder="Search by Job ID, Address, or Client Name" />
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
          <Row>
            <Col>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th><Form.Check /> Job ID</th>
                    <th>Address</th>
                    <th>Client</th>
                    <th>Assigned Staff</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {sjobs.map((sj,idx)=>(
                  <tr key={idx}>
                    <td><Form.Check inline />{sj.id}</td>
                    <td>{sj.address}</td>
                    <td>{sj.client}</td>
                    <td>{sj.assigned}</td>
                    <td>{sj.start_date}</td>
                    <td><span className={
    sj.status === "Completed" ? "badge bg-success" :
    sj.status === "Scheduled" ? "badge bg-primary" :
    sj.status === "In Progress" ? "badge bg-warning text-dark" :
    "badge bg-secondary"
  }>{sj.status}</span></td>
                    <td className="text-end"><ThreeDots /></td>
                  </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Job;
