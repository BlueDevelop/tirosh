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
      inputPlaceholder: "Type your title here...",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });

    if (title) {
      Swal.fire(`Your event is ${title}`);
      const event = {
        title: title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay,
        color: "#378006"
      };
      console.log(event);
      const result = await axios.post("api/events", { event });
      setEvents([...events, event]);
    }
  };
  const handleEventClick = async event => {
    console.log(event);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        html: `Your event is ${event.event._def.title}`,
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
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
              "Deleted!",
              "Your file has been deleted.",
              "success"
            );
          }
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)",
            "error"
          );
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
      // select={arg => {
      //   setEvents([
      //     ...events,
      //     {
      //       title: "New Event",
      //       start: arg.start,
      //       end: arg.end,
      //       allDay: arg.allDay,
      //       color: "#378006"
      //     }
      //   ]);
      // }}
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
