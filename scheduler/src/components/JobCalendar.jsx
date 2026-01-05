import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./JobCalendar.css";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  Scheduled: "#1565c0",     // blue
  "In Progress": "#f9a825", // yellow
  Completed: "#2e7d32",     // green
  Cancelled: "#c62828"      // red
};

function JobCalendar() {
  const [events,setEvents] = useState([]);
  const navigate = useNavigate(); 

  // useEffect(() => {
  //   fetch("http://localhost:8000/calendar")
  //     .then(res => res.json())
  //     .then(data => {
  //       const jobs = {};

  //       data.forEach(job => {
  //         if (!jobs[job.jobid]) {
  //           jobs[job.jobid] = {
  //             id: job.jobid,
  //             title: `Job ${job.jobid}`,
  //             start: job.jobdate,
  //             allDay: true,
  //             count: 1
  //           };
  //         } else {
  //           jobs[job.jobid].count += 1;
  //         }
  //       });

  //       setEvents(
  //         Object.values(jobs).map(job => ({
  //           ...job,
  //           title: `${job.title} (${job.count} employees)`
  //         }))
  //       );
  //     })
  //     .catch(err => console.log(err));
  // }, []); 

  useEffect(() => {
    fetch("http://localhost:8000/calendar")
      .then(res => res.json())
      .then(data => {
        const jobs = {};

        data.forEach(job => {
          jobs[job.jobid] = {
            id: job.jobid,
            title: `Job ${job.jobid}`,
            start: job.jobdate,
            allDay: true,
            backgroundColor: STATUS_COLORS[job.status] || "#616161",
            borderColor: STATUS_COLORS[job.status] || "#616161",
            textColor: "#fff"
          };
        });

        setEvents(Object.values(jobs));
      })
      .catch(err => console.log(err));
  }, []);


  const handleDateClick = (info) => {
    alert(`Clicked date: ${info.dateStr}`);
    // Later → show scheduled jobs panel / modal
  };

  // const handleEventClick = (info) => {
  //   alert(`Job clicked: ${info.event.title}`);
  // };
  const handleEventClick = (info) => {
    const jobId = info.event.id; // get the job id from event
    navigate(`/jobs/${jobId}`);  // navigate to JobDetails page
  };


  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      height="auto"
    />
  );
}

export default JobCalendar;
