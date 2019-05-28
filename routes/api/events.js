const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../auth");
const Events = mongoose.model("Events");

//POST new update route (required, only authenticated users have access)
router.post("/", auth.required, (req, res, next) => {
  const {
    body: { event }
  } = req;

  if (!event.title) {
    return res.status(422).json({
      errors: {
        title: "is required"
      }
    });
  }
  if (!event.start) {
    return res.status(422).json({
      errors: {
        startDate: "is required"
      }
    });
  }

  const finalEvent = new Events(event);

  return finalEvent.save().then(result => res.json({ event: result }));
});

//GET allUpdates route (required, everyone has access)
router.get("/all", auth.optional, (req, res, next) => {
  Events.find().then(events => {
    return res.json({ events: events });
  });
});

//GET allUpdates route (required, everyone has access)
router.delete("/delete/:id", auth.required, (req, res, next) => {
  const {
    params: { id }
  } = req;
  return Events.remove({ _id: id }).then(result => {
    return res.json({ result });
  });
});

module.exports = router;
