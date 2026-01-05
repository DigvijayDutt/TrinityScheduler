import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col, Badge } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "./JobDetails.css";


const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/scheduledjobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:8000/employees")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.log(err));
  }, []);

  const employeeMap = employees.reduce((acc, emp) => {
    acc[emp.id] = emp.name;
    return acc;
  }, {});

  if (!job) return <p className="p-4">Loading...</p>;

  return (
    <div className="d-flex">
      <Sidebar />

      <main className="flex-grow-1 p-4 bg-light">
        <Container>
          <div
            className="job-back"
            onClick={() => navigate(-1)}
            >
            <span className="job-back-arrow">←</span>
            <span>Back to Jobs</span>
            </div>


          <Card className="mt-3">
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <h3>Job #{job.id}</h3>
                </Col>
                <Col className="text-end">
                  <Badge
                    bg={
                      job.status === "Completed" ? "success" :
                      job.status === "Scheduled" ? "primary" :
                      job.status === "In Progress" ? "warning" :
                      job.status === "Cancelled" ? "danger" :
                      "secondary"
                    }
                  >
                    {job.status}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col md={6}><strong>Client:</strong> {job.client}</Col>
                <Col md={6}><strong>Job Type:</strong> {job.type}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={6}><strong>Address:</strong> {job.address}</Col>
                <Col md={6}><strong>Start Date:</strong> {job.start_date}</Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <strong>Assigned Staff:</strong>
                  <ul className="mt-2">
                    {job.assigned.map(id => (
                      <li key={id}>{employeeMap[id] || `ID ${id}`}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </main>
    </div>
  );
};

export default JobDetails;
