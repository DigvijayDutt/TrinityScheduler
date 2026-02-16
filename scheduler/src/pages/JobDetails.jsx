import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col, Badge } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "./JobDetails.css";


const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  // const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/scheduledjobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.log(err));
  }, [id]);



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
                <Col md={6}>
                  <strong>Start Date:</strong> {job.start_date?.split("T")[0] || "—"} <br/>
                  <strong>Start Time:</strong> {job.start_time || "—"} <br/>
                  <strong>End Time:</strong> {job.end_time || "—"}
                </Col>
              </Row>


              <Row className="mt-3">
                <Col>
                  <strong>Assigned Staff:</strong>
                  {/* <ul className="mt-2">
                    {job.assigned.map(id => (
                      <li key={id}>{employeeMap[id] || `ID ${id}`}</li>
                    ))}
                  </ul> */}
                  <ul className="mt-2">
                    {job.assigned_staff_display
                      ?.split(", ")
                      .map((name, index) => (
                        <li key={index} className="d-flex align-items-center gap-2">
                          {name.includes("(Team lead)") ? (
                            <>
                              <span>{name.replace("(Team lead)", "")}</span>
                              <Badge bg="info" pill>Team Lead</Badge>
                            </>
                          ) : (
                            <span>{name}</span>
                          )}
                        </li>
                      ))}
                  </ul>

                </Col>
              </Row>
              {/* Extra job details (only visible on Job Details page) */}
              <Row className="mt-3">
                <Col md={6}>
                  <strong>Loss Type:</strong> {job.loss_type || "—"}
                </Col>
                <Col md={6}>
                  <strong>Project Manager:</strong> {job.project_manager || "—"}
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={6}>
                  <strong>Vehicle:</strong> {job.vehicle || "—"}
                </Col>
                <Col md={6}>
                  <strong>Job Time:</strong> {job.job_time || "—"}
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <strong>Special Instructions:</strong>
                  <p className="mb-0">
                    {job.special_instructions || "None"}
                  </p>
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
