import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";

const MySwal = withReactContent(Swal);

function Calendar() {
  const [events, setEvents] = useState([]);

  // call api to fetch events
  useEffect(async () => {
    const result = await axios("api/events/all");
    if (result.data.events) {
      setEvents(result.data.events);
    }
  }, []);

  const handleClick = async arg => {
    const { value: title } = await Swal.fire({
      input: "text",
      inputPlaceholder: "בחר שם לאירוע...",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "הקלד שם לאירוע כדי להמשיך...";
        }
      }
    });

    if (title) {
      Swal.fire(`האירוע הוא ${title}`);
      const event = {
        title: title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay,
        color: "#378006"
      };
      const result = await axios.post("api/events", { event });
      console.log(result);
      setEvents([...events, result.data.event]);
    }
  };
  const handleEventClick = async event => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });

    swalWithBootstrapButtons
      .fire({
        title: "האם אתה בטוח?",
        html: `האירוע הוא ${event.event._def.title}`,
        text: "לא תוכל להתחרט!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "כן, מחק!",
        cancelButtonText: "לא, בטל!",
        reverseButtons: true
      })
      .then(async result => {
        if (result.value) {
          const result = await axios.delete(
            `api/events/delete/${event.event._def.extendedProps._id}`
          );
          if (result) {
            const valueToRemove = event.event._def.extendedProps._id;
            const newArray = events.filter(item => item._id !== valueToRemove);
            setEvents(newArray);
            swalWithBootstrapButtons.fire(
              "נמחק!",
              "האירוע נמחק בהצלחה",
              "success"
            );
          }
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire("בוטל", "האירוע לא נמחק", "error");
        }
      });
  };
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
      eventClick={handleEventClick}
      select={handleClick}
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
