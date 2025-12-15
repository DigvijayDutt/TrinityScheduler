import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./JobCalendar.css";


function JobCalendar() {
  const [events,setEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/calendar")
      .then(res => res.json())
      .then(data => {
        const jobs = {};

        data.forEach(job => {
          if (!jobs[job.jobid]) {
            jobs[job.jobid] = {
              id: job.jobid,
              title: `Job ${job.jobid}`,
              start: job.jobdate,
              allDay: true,
              count: 1
            };
          } else {
            jobs[job.jobid].count += 1;
          }
        });

        setEvents(
          Object.values(jobs).map(job => ({
            ...job,
            title: `${job.title} (${job.count} employees)`
          }))
        );
      })
      .catch(err => console.log(err));
  }, []);

  const handleDateClick = (info) => {
    alert(`Clicked date: ${info.dateStr}`);
    // Later → show scheduled jobs panel / modal
  };

  const handleEventClick = (info) => {
    alert(`Job clicked: ${info.event.title}`);
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
