const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../auth");
const Updates = mongoose.model("Updates");

//POST new update route (required, only authenticated users have access)
router.post("/", auth.required, (req, res, next) => {
  const {
    body: { update }
  } = req;

  if (!update.text) {
    return res.status(422).json({
      errors: {
        text: "is required"
      }
    });
  }

  update.created = new Date();
  const finalUpdate = new Updates(update);

  return finalUpdate.save().then(result => res.json({ update: result }));
});

//GET allUpdates route (optional, everyone has access)
router.get("/all", auth.optional, (req, res, next) => {
  Updates.find().then(updates => {
    return res.json({ updates: updates });
  });
});

//DELETE update route (required, everyone has access)
router.delete("/delete/:id", auth.required, (req, res, next) => {
  const {
    params: { id }
  } = req;
  return Updates.remove({ _id: id }).then(result => {
    return res.json({ result });
  });
});

module.exports = router;
