import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";
import { CircleLoader } from "react-spinners";
import "./Calendar.css";

//import Popup from "./popUp";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";

const calendarRef = React.createRef();
const MySwal = withReactContent(Swal);

function Calendar(user) {
  const Hebrew = {
    weekdays: {
      shorthand: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      longhand: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
    },
    months: {
      shorthand: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"],
      longhand: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
    },
    rangeSeparator: " אל ",
    time_24hr: true
  };

  const [events, setEvents] = useState([]);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const login = async () => {
      const loginUser = await axios.get("api/users/login");
      setUserData(loginUser.data);
    };
    login();
  }, []);

  let tiroshEvents = true;
  let Toast = {};
  const eventMouseEnter = info => {
    Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      position: "bottom",
      animation: false,
      padding: "2rem",
      background: "#f7e6d2"
    });
    Toast.fire({
      title: info.event.title
    });
  };

  const eventMouseLeave = () => {
    Toast.close();
  };

  const [mouseEvents, setMouseEvents] = useState({
    eventMouseEnter: eventMouseEnter,
    eventMouseLeave: eventMouseLeave
  });

  const getEvents = async () => {
    setLoading(true);
    addActiveClass();
    let CA = calendarRef.current.getApi();
    const start = moment(CA.state.dateProfile.currentRange.start).format("YYYY-MM-DD HH:mm:ss");
    const end = moment(CA.state.dateProfile.currentRange.end).format("YYYY-MM-DD HH:mm:ss");
    const result = await axios(`api/events/all?start=${start}&end=${end}&tiroshEvents=${tiroshEvents}`);
    if (result.data.appointments) {
      setEvents(result.data.appointments);
      addActiveClass();
    }
    setLoading(false);
    addActiveClass();
    const button = document.getElementsByClassName("fc-button-group")[0];
    button.addEventListener("click", () => {
      getEvents();
    });
  };

  useEffect(async () => {
    getEvents();
  }, []);

  const handleClick = async arg => {
    if (showMyEvents || userData.role == 0) {
      return;
    }
    // const { value: formValues } = await MySwal.fire({
    //   title: <p>צור אירוע חדש</p>,
    //   html: (
    //     <div>
    //       <input type="text" id="swal-input1" class="swal2-input" placeholder="כותרת" />
    //       <input type="text" id="swal-input2" class="swal2-input" placeholder="מיקום" />
    //       <input id="start" type="datetime-local" class="swal2-input disabled" value={moment(arg.start).format("dddd, MMMM Do YYYY, h:mm:ss a")} />
    //       <input id="end" type="datetime-local" class="swal2-input disabled" value={moment(arg.end).format("dddd, MMMM Do YYYY, h:mm:ss a")} />
    //     </div>
    //   )
    // });
    const { value: formValues } = await Swal.fire({
      onBeforeOpen: () => {
        document.getElementById("start").flatpickr({
          enableTime: true,
          locale: Hebrew
        });
        document.getElementById("end").flatpickr({
          enableTime: true,
          locale: Hebrew
        });
      },
      title: "צור אירוע חדש",
      html: `
        <input type="text" id="swal-input1" class="swal2-input" placeholder="כותרת">
        <input type="text" id="swal-input2" class="swal2-input" placeholder="מיקום">

        התחלה
          <input id="start" type="datetime-local" id="swal-input3" class="swal2-input disabled" value="${moment(arg.start).format(
            "YYYY-MM-DD"
          )}T${moment(arg.start).format("HH:mm:ss")}" ${
        (moment(arg.start).hours() == 0 && moment(arg.start).minutes() == 0 && moment(arg.end).hours() == 0 && moment(arg.end).minutes() == 0) ||
        arg.allDay
          ? "disabled"
          : ""
      }>
          סיום
          <input id="end" type="datetime-local" id="swal-input4" class="swal2-input disabled" value="${moment(arg.end).format("YYYY-MM-DD")}T${moment(
        arg.end
      ).format("HH:mm:ss")}" ${
        (moment(arg.start).hours() == 0 && moment(arg.start).minutes() == 0 && moment(arg.end).hours() == 0 && moment(arg.end).minutes() == 0) ||
        arg.allDay
          ? "disabled"
          : ""
      }>
          כל היום
          <input type="checkbox" id="swal-input5" class="swal2-input" value="false" ${
            (moment(arg.start).hours() == 0 && moment(arg.start).minutes() == 0 && moment(arg.end).hours() == 0 && moment(arg.end).minutes() == 0) ||
            arg.allDay
              ? "checked"
              : ""
          } onclick='
          document.getElementById("start").disabled = !document.getElementById(
            "start"
          ).disabled;
          document.getElementById("end").disabled = !document.getElementById("end")
            .disabled;
          '>`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("start").value,
          document.getElementById("end").value,
          document.getElementById("swal-input5").checked
        ];
      }
    });

    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
      const event = {
        Subject: formValues[0],
        Location: formValues[1],
        Start: moment(formValues[2]).format("YYYY-MM-DD HH:mm:ss"),
        End: moment(formValues[3]).format("YYYY-MM-DD HH:mm:ss"),
        IsAllDayEvent: formValues[4]
      };
      if (event.IsAllDayEvent) {
        event.Start = moment(event.Start)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        event.End =
          moment(event.End).hours() != 0 || moment(event.End).minutes() != 0
            ? moment(event.End)
                .add(1, "days")
                .startOf("day")
                .format("YYYY-MM-DD HH:mm:ss")
            : event.End;
      }
      const result = await axios.post("api/events", { event });
      setEvents([...events, result.data]);
      addActiveClass();
    }
  };

  const handleEventClick = async event => {
    setMouseEvents({
      eventMouseEnter: undefined,
      eventMouseLeave: undefined
    });
    const eventToUpdate = event.event._def.extendedProps;
    const start = event.event.start;
    const end = event.event.end;

    const { value: formValues } = await Swal.fire({
      title: userData.role == 1 || !showMyEvents ? "עדכן אירוע" : "אירוע",
      showCancelButton: true,
      showConfirmButton: userData.role == 1 && !showMyEvents ? true : false,

      cancelButtonText: "בטל",
      confirmButtonText: "עדכן",
      html: `
      <input type="text" id="swal-input1" class="swal2-input" placeholder="כותרת" ${userData.role == 0 || showMyEvents ? "disabled" : ""} value="${
        eventToUpdate.subject
      }">
      <input type="text" id="swal-input2" class="swal2-input" placeholder="מיקום" ${userData.role == 0 || showMyEvents ? "disabled" : ""} value="${
        eventToUpdate.location
      }">
      התחלה
        <input id="start" type="datetime-local" id="swal-input3" class="swal2-input disabled" ${
          userData.role == 0 || showMyEvents ? "disabled" : ""
        } value="${moment(start).format("YYYY-MM-DD")}T${moment(start).format("HH:mm:ss")}" ${
        (moment(start).hours() == 0 && moment(start).minutes() == 0 && moment(end).hours() == 0 && moment(end).minutes() == 0) ||
        eventToUpdate.allDay ||
        userData.role == 0 ||
        showMyEvents
          ? "disabled"
          : ""
      }>
        סיום
        <input id="end" type="datetime-local" id="swal-input4" class="swal2-input disabled" ${userData.role == 0 || showMyEvents ? "disabled" : ""} 
        value="${moment(end).format("YYYY-MM-DD")}T${moment(end).format("HH:mm:ss")}" ${
        (moment(start).hours() == 0 && moment(start).minutes() == 0 && moment(end).hours() == 0 && moment(end).minutes() == 0) ||
        eventToUpdate.allDay ||
        userData.role == 0 ||
        showMyEvents
          ? "disabled"
          : ""
      }>
        כל היום
        <input type="checkbox" id="swal-input5" class="swal2-input" ${userData.role == 0 || showMyEvents ? "disabled" : ""} value="false" ${
        (moment(start).hours() == 0 && moment(start).minutes() == 0 && moment(end).hours() == 0 && moment(end).minutes() == 0) || eventToUpdate.allDay
          ? "checked"
          : ""
      } onclick='
        document.getElementById("start").disabled = !document.getElementById(
          "start"
        ).disabled;
        document.getElementById("end").disabled = !document.getElementById("end")
          .disabled;
        '>
        ${
          !showMyEvents && userData.role == 1
            ? '<button id="delete" class="swal2-cancel swal2-styled" style="backround-color:#dd3333"> מחק </button>'
            : ""
        }
        
        `,
      focusConfirm: false,
      onBeforeOpen: () => {
        if (userData.role == 1 && !showMyEvents) {
          document.getElementById("delete").addEventListener("click", () => {
            handleDeleteClick(event);
          });
        }
        document.getElementById("start").flatpickr({
          enableTime: true,
          locale: Hebrew
        });
        document.getElementById("end").flatpickr({
          enableTime: true,
          locale: Hebrew
        });
      },
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("start").value,
          document.getElementById("end").value,
          document.getElementById("swal-input5").checked
        ];
      }
    });

    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
      const newEvent = {
        id: event.event._def.publicId,
        Subject: formValues[0],
        Location: formValues[1],
        Start: moment(formValues[2]).format("YYYY-MM-DD HH:mm:ss"),
        End: moment(formValues[3]).format("YYYY-MM-DD HH:mm:ss"),
        IsAllDayEvent: formValues[4]
      };

      if (newEvent.IsAllDayEvent) {
        newEvent.Start = moment(newEvent.Start)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        newEvent.End =
          moment(newEvent.End).hours() != 0 || moment(newEvent.End).minutes() != 0
            ? moment(newEvent.End)
                .add(1, "days")
                .startOf("day")
                .format("YYYY-MM-DD HH:mm:ss")
            : newEvent.End;
      }
      const result = await axios.put("api/events", { event: newEvent });
      let newArray = events.filter(item => item.id != event.event._def.publicId);
      setEvents([...newArray, result.data]);
      addActiveClass();
    }
    setMouseEvents({
      eventMouseEnter: eventMouseEnter,
      eventMouseLeave: eventMouseLeave
    });
    addActiveClass();
  };
  const handleDeleteClick = async event => {
    setMouseEvents({
      eventMouseEnter: undefined,
      eventMouseLeave: undefined
    });
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
          const result = await axios.delete(`api/events/delete/`, {
            params: { id: event.event._def.publicId }
          });
          if (result) {
            const valueToRemove = event.event._def.publicId;
            const newArray = events.filter(item => item.id !== valueToRemove);
            setEvents(newArray);
            addActiveClass();
            swalWithBootstrapButtons.fire("נמחק!", "האירוע נמחק בהצלחה", "success");
          }
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire("בוטל", "האירוע לא נמחק", "error");
        }
        addActiveClass();
      });
  };
  const addActiveClass = () => {
    if (tiroshEvents) {
      document.getElementsByClassName("fc-systemEvents-button")[0].classList.add("my-active");
    } else {
      document.getElementsByClassName("fc-myEvents-button")[0].classList.add("my-active");
    }
  };
  return (
    <div>
      <div className="sweet-loading">
        <CircleLoader color={"#385723"} loading={loading} />
      </div>
      <FullCalendar
        ref={calendarRef}
        locale="he"
        defaultView="dayGridMonth"
        selectable={true}
        customButtons={{
          myEvents: {
            text: "אירועים שלי",
            click: function() {
              const flag = document.getElementsByClassName("fc-myEvents-button")[0].classList.contains("my-active");
              if (!flag) {
                setShowMyEvents(true);
                tiroshEvents = false;
                getEvents();
              }
            }
          },
          systemEvents: {
            text: "אירועי מערכת",
            click: function() {
              const flag = document.getElementsByClassName("fc-systemEvents-button")[0].classList.contains("my-active");
              if (!flag) {
                setShowMyEvents(false);
                tiroshEvents = true;
                getEvents();
              }
            }
          }
        }}
        header={{
          left: "prev,next today",
          center: "title",
          right: "systemEvents,myEvents dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        eventClick={tiroshEvents ? handleEventClick : null}
        select={tiroshEvents ? handleClick : null}
        buttonText={{
          today: "היום",
          month: "חודש",
          week: "שבוע",
          day: "יום",
          list: "רשימה"
        }}
        eventMouseEnter={mouseEvents.eventMouseEnter}
        eventMouseLeave={mouseEvents.eventMouseLeave}
        events={events}
      />
    </div>
  );
}

export default Calendar;
