var express = require("express");
var router = express.Router();
const passport = require("passport");

router.get("/", passport.authenticate("shraga"), function(req, res, next) {
  console.log(req.user);
  // res.sendFile(path.join(__dirname, "client/build", "index.html"));
  // res.redirect("/");
  return res.status(200).json(req.user);
});

router.post("/callback", passport.authenticate("shraga"), function(
  req,
  res,
  next
) {
  res.redirect("/");
});

module.exports = router;
