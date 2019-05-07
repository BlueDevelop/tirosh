import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";

function Calendar() {
  const [events, setEvents] = useState([
    { title: "Event Now", start: new Date() }
  ]);

  // call api to fetch events
  useEffect(() => {});

  return (
    <FullCalendar
      locale="he"
      defaultView="dayGridMonth"
      selectable={true}
      header={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
      }}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      //   dateClick={arg => {
      //     setEvents([
      //       ...events,
      //       {
      //         title: "New Event",
      //         start: arg.date,
      //         allDay: arg.allDay
      //       }
      //     ]);
      //   }}
      select={arg => {
        setEvents([
          ...events,
          {
            title: "New Event",
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          }
        ]);
      }}
      buttonText={{
        today: "היום",
        month: "חודש",
        week: "שבוע",
        day: "יום",
        list: "רשימה"
      }}
      events={events}
    />
  );
}

export default Calendar;
