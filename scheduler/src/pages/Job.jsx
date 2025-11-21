// Job.jsx
import { useEffect, useState} from "react";
import "./Job.css";

// New Sidebar Component
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
  DropdownItem,
} from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:8000/jobTypes")
    .then(res => res.json())
    .then(data => setJobs(data))
    .catch(err=>console.log(err));
  },[]);

  useEffect(()=>{
    fetch("http://localhost:8000/employeeNames")
    .then(res => res.json())
    .then(data => setEmployees(data))
    .catch(err=>console.log(err));
  },[]);

  return (
    <div className="d-flex w-100">
      
      {/* Sidebar (Left Fixed Section) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        <Container fluid>
          
          {/* Header Section */}
          <Row className="mb-4">
            <Col>
              <h1 className="page-title mb-1">Job Management</h1>
              <p className="text-muted">Create, edit, and track active jobs.</p>
            </Col>
            <Col xs="auto">
              <Button variant="primary">
                <span className="material-symbols-outlined">add</span> Create New Job
              </Button>
            </Col>
          </Row>

          {/* Search + Filter Section */}
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
                {employees.map((emp,index)=>(
                  <Dropdown.Item key={index}>{emp}</Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton title="Job Type" variant="outline-secondary">
                  {jobs.map((job,index)=>(
                    <Dropdown.Item key={index}>{job}</Dropdown.Item>
                  ))}
              </DropdownButton>

              <DropdownButton title="Date Range" variant="outline-secondary">
                <Dropdown.Item>Last 7 Days</Dropdown.Item>
                <Dropdown.Item>Last 30 Days</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>

          {/* Table Section */}
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
                  <tr>
                    <td><Form.Check inline /> J-10234</td>
                    <td>123 Maple Street</td>
                    <td>Acme Corp</td>
                    <td>John Smith</td>
                    <td>2024-07-28</td>
                    <td><span className="badge bg-success">Completed</span></td>
                    <td className="text-end"><ThreeDots /></td>
                  </tr>

                  <tr>
                    <td><Form.Check inline /> J-10235</td>
                    <td>456 Oak Avenue</td>
                    <td>Innovate Inc.</td>
                    <td>Jane Doe</td>
                    <td>2024-08-01</td>
                    <td><span className="badge bg-primary">Scheduled</span></td>
                    <td className="text-end"><ThreeDots /></td>
                  </tr>

                  <tr>
                    <td><Form.Check inline /> J-10236</td>
                    <td>789 Pine Lane</td>
                    <td>Tech Solutions</td>
                    <td>Robert Brown</td>
                    <td>2024-08-05</td>
                    <td><span className="badge bg-warning text-dark">In Progress</span></td>
                    <td className="text-end"><ThreeDots /></td>
                  </tr>

                  <tr>
                    <td><Form.Check inline /> J-10237</td>
                    <td>101 Birch Blvd</td>
                    <td>Global Exports</td>
                    <td>Emily White</td>
                    <td>2024-08-10</td>
                    <td><span className="badge bg-danger">On Hold</span></td>
                    <td className="text-end"><ThreeDots /></td>
                  </tr>
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
