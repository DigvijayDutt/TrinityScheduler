import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./JobCalendar.css";


function JobCalendar() {
  // TEMP FRONTEND DATA (replace with API later)
  const [events] = useState([
    {
      title: "J-10234 (Upcoming)",
      date: "2025-12-25",
      backgroundColor: "#60a5fa",
      borderColor: "#60a5fa",
    },
    {
      title: "J-10235 (Ongoing)",
      date: "2025-12-26",
      backgroundColor: "#facc15",
      borderColor: "#facc15",
      textColor: "#000",
    },
    {
      title: "J-10236 (Completed)",
      date: "2025-12-27",
      backgroundColor: "#22c55e",
      borderColor: "#22c55e",
    },
  ]);

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
