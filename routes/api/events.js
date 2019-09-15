const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../auth");
const passport = require("passport");
const Events = mongoose.model("Events");
const axios = require("axios");

const exchangeServiceApi = process.env.EXCHANGE_SERVICE_API;
const tiroshEmail = process.env.TIROSH_EMAIL;
let password = process.env.PASSWORD;

router.put("/", (req, res, next) => {
  const {
    body: { event }
  } = req;

  if (!event.Subject) {
    return res.status(422).json({
      errors: {
        subject: "is required"
      }
    });
  }
  if (!event.Start) {
    return res.status(422).json({
      errors: {
        Start: "is required"
      }
    });
  }
  if (!event.End) {
    return res.status(422).json({
      errors: {
        End: "is required"
      }
    });
  }
  event.RequiredAttendees = [tiroshEmail];

  axios
    .put(exchangeServiceApi + "/api/appointments", {
      Appointment: event,
      ImpersonateUser: tiroshEmail,
      Password: password
    })
    .then(createdEvent => {
      let appointment = createdEvent.data.appointments[0];
      appointment.title = appointment.subject;
      appointment.allday = appointment.isAllDayEvent;
      appointment.color = "#378006";
      res.status(200).json(appointment);
    })
    .catch(error => res.status(500).send({ error: error }));
});

//POST new update route (required, only authenticated users have access)
router.post("/", (req, res, next) => {
  const {
    body: { event }
  } = req;

  if (!event.Subject) {
    return res.status(422).json({
      errors: {
        subject: "is required"
      }
    });
  }
  if (!event.Start) {
    return res.status(422).json({
      errors: {
        Start: "is required"
      }
    });
  }
  if (!event.End) {
    return res.status(422).json({
      errors: {
        End: "is required"
      }
    });
  }
  event.ImpersonateUser = tiroshEmail;
  event.RequiredAttendees = [tiroshEmail];
  event.password = password;

  // const finalEvent = new Events(event);
  axios
    .post(exchangeServiceApi + "/api/appointments", event)
    .then(createdEvent => {
      console.log(createdEvent);
      let appointment = createdEvent.data.appointments[0];
      appointment.title = appointment.subject;
      appointment.allday = appointment.isAllDayEvent;
      appointment.color = "#378006";
      res.status(200).json(appointment);
    })
    .catch(error => res.status(500).send({ error: error }));
});

//GET allUpdates route (required, everyone has access)
router.get("/all", (req, res, next) => {
  const start = req.query.start;
  const end = req.query.end;
  const email = req.user.uniqueId.substring(0, req.user.uniqueId.indexOf("@")) + process.env.DOMIN_EMAIL;
  const userEmail = req.query.tiroshEvents == "true" ? tiroshEmail : email;
  axios
    .get(exchangeServiceApi + "/api/appointments", {
      params: {
        Start: start,
        End: end,
        UserEmail: userEmail,
        password: password
      }
    })
    .then(response => {
      const body = response.data;
      body.appointments = body.appointments.map(appointment => {
        appointment.title = appointment.subject;
        appointment.allday = appointment.isAllDayEvent;
        appointment.color = "#378006";
        return appointment;
      });
      return res.json(body);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(err);
    });
});

//GET allUpdates route (required, everyone has access)
router.delete("/delete", (req, res, next) => {
  const id = req.query.id;

  axios
    .delete(exchangeServiceApi + "/api/appointments", {
      params: {
        id: id,
        userEmail: tiroshEmail,
        Password: password
      }
    })
    .then(response => {
      res.status(200).json({ numDeleted: 1 });
    })
    .catch(response => {
      res.status(500).json({ numDeleted: 0 });
    });
});

module.exports = router;
